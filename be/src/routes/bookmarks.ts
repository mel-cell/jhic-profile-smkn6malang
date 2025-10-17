import { Hono } from 'hono';
import { z } from 'zod';
import { BookmarkService } from '../services/bookmarkService';
import { authenticate } from '../middlewares/auth';
import prisma from '../config/database';

const bookmarks = new Hono();

const createBookmarkSchema = z.object({
  jobPostingId: z.string(),
});

// GET /bookmarks - Get user bookmarks
bookmarks.get('/', authenticate, async (c) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ bookmarks: [] });
    }

    const bookmarks = await BookmarkService.getStudentBookmarks(studentProfile.id, limit, offset);
    return c.json({ bookmarks });
  } catch (error) {
    return c.json({ error: 'Failed to fetch bookmarks' }, 500);
  }
});

// POST /bookmarks - Add bookmark
bookmarks.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = createBookmarkSchema.parse(body);

    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ error: 'Student profile not found' }, 404);
    }

    const bookmark = await BookmarkService.addBookmark({
      studentProfileId: studentProfile.id,
      jobPostingId: validated.jobPostingId,
    });

    return c.json({ bookmark }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to add bookmark' }, 500);
  }
});

// DELETE /bookmarks/:jobPostingId - Remove bookmark
bookmarks.delete('/:jobPostingId', authenticate, async (c) => {
  const user = c.get('user');
  const jobPostingId = c.req.param('jobPostingId');

  try {
    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ error: 'Student profile not found' }, 404);
    }

    await BookmarkService.removeBookmark(studentProfile.id, jobPostingId);
    return c.json({ message: 'Bookmark removed' });
  } catch (error) {
    return c.json({ error: 'Failed to remove bookmark' }, 500);
  }
});

// GET /bookmarks/check/:jobPostingId - Check if job is bookmarked
bookmarks.get('/check/:jobPostingId', authenticate, async (c) => {
  const user = c.get('user');
  const jobPostingId = c.req.param('jobPostingId');

  try {
    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ isBookmarked: false });
    }

    const isBookmarked = await BookmarkService.isBookmarked(studentProfile.id, jobPostingId);
    return c.json({ isBookmarked });
  } catch (error) {
    return c.json({ error: 'Failed to check bookmark status' }, 500);
  }
});

export default bookmarks;
