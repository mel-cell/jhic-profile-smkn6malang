import { Hono } from 'hono';
import { z } from 'zod';
import { InterviewService } from '../services/interviewService';
import { authenticate } from '../middlewares/auth';

const interviews = new Hono();

const createInterviewSchema = z.object({
  jobApplicationId: z.string(),
  interviewDate: z.string().datetime(),
  interviewType: z.enum(['online', 'offline']),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const updateInterviewSchema = z.object({
  interviewDate: z.string().datetime().optional(),
  interviewType: z.enum(['online', 'offline']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

// GET /interviews - Get user interviews
interviews.get('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const interviews = await InterviewService.getUpcomingInterviews(user.id, user.role);
    return c.json({ interviews });
  } catch (error) {
    return c.json({ error: 'Failed to fetch interviews' }, 500);
  }
});

// POST /interviews - Schedule interview
interviews.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = createInterviewSchema.parse(body);

    const interview = await InterviewService.scheduleInterview({
      jobApplicationId: validated.jobApplicationId,
      scheduledAt: new Date(validated.interviewDate),
      location: validated.location,
      interviewType: validated.interviewType,
      notes: validated.notes,
    });

    return c.json({ interview }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to schedule interview' }, 500);
  }
});

// GET /interviews/:id - Get interview by ID
interviews.get('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const interviewId = c.req.param('id');

  try {
    const interview = await InterviewService.getInterviewById(interviewId);
    if (!interview) {
      return c.json({ error: 'Interview not found' }, 404);
    }
    return c.json({ interview });
  } catch (error) {
    return c.json({ error: 'Failed to fetch interview' }, 500);
  }
});

// PUT /interviews/:id - Update interview
interviews.put('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const interviewId = c.req.param('id');

  try {
    const body = await c.req.json();
    const validated = updateInterviewSchema.parse(body);

    const interview = await InterviewService.updateInterview(interviewId, validated);
    return c.json({ interview });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update interview' }, 500);
  }
});

// DELETE /interviews/:id - Cancel interview
interviews.delete('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const interviewId = c.req.param('id');

  try {
    await InterviewService.cancelInterview(interviewId);
    return c.json({ message: 'Interview cancelled' });
  } catch (error) {
    return c.json({ error: 'Failed to cancel interview' }, 500);
  }
});

// GET /interviews/upcoming - Get upcoming interviews
interviews.get('/upcoming', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const interviews = await InterviewService.getUpcomingInterviews(user.id, user.role);
    return c.json({ interviews });
  } catch (error) {
    return c.json({ error: 'Failed to fetch upcoming interviews' }, 500);
  }
});

export default interviews;
