import { Hono } from 'hono';
import { z } from 'zod';
import { ReviewService } from '../services/reviewService';
import { authenticate } from '../middlewares/auth';
import prisma from '../config/database';

const reviews = new Hono();

const createReviewSchema = z.object({
  companyProfileId: z.string(),
  jobApplicationId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  comment: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

// GET /reviews/company/:companyId - Get company reviews
reviews.get('/company/:companyId', async (c) => {
  const companyId = c.req.param('companyId');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const reviews = await ReviewService.getCompanyReviews(companyId, limit, offset);
    const stats = await ReviewService.getCompanyAverageRating(companyId);

    return c.json({
      reviews,
      stats,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// GET /reviews/my - Get user's reviews
reviews.get('/my', authenticate, async (c) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ reviews: [] });
    }

    const reviews = await ReviewService.getStudentReviews(studentProfile.id, limit, offset);
    return c.json({ reviews });
  } catch (error) {
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// POST /reviews - Create review
reviews.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = createReviewSchema.parse(body);

    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ error: 'Student profile not found' }, 404);
    }

    const review = await ReviewService.createReview({
      ...validated,
      studentProfileId: studentProfile.id,
    });

    return c.json({ review }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

// GET /reviews/:id - Get review by ID
reviews.get('/:id', async (c) => {
  const reviewId = c.req.param('id');

  try {
    const review = await ReviewService.getReviewById(reviewId);
    if (!review) {
      return c.json({ error: 'Review not found' }, 404);
    }
    return c.json({ review });
  } catch (error) {
    return c.json({ error: 'Failed to fetch review' }, 500);
  }
});

// PUT /reviews/:id - Update review
reviews.put('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const reviewId = c.req.param('id');

  try {
    const body = await c.req.json();
    const validated = createReviewSchema.partial().parse(body);

    const review = await ReviewService.updateReview(reviewId, validated);
    return c.json({ review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update review' }, 500);
  }
});

// DELETE /reviews/:id - Delete review
reviews.delete('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const reviewId = c.req.param('id');

  try {
    await ReviewService.deleteReview(reviewId);
    return c.json({ message: 'Review deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete review' }, 500);
  }
});

export default reviews;
