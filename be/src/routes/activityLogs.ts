import { Hono } from 'hono';
import { z } from 'zod';
import { ActivityLogService } from '../services/activityLogService';
import { authenticate, requireAdmin } from '../middlewares/auth';

const activityLogs = new Hono();

const logActivitySchema = z.object({
  action: z.string().min(1),
  details: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// POST /activity-logs - Log activity (internal use)
activityLogs.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = logActivitySchema.parse(body);

    const log = await ActivityLogService.logActivity({
      userId: user.id,
      ...validated,
    });

    return c.json({ log }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to log activity' }, 500);
  }
});

// GET /activity-logs/my - Get user's activity logs
activityLogs.get('/my', authenticate, async (c) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const logs = await ActivityLogService.getUserActivityLogs(user.id, limit, offset);
    return c.json({ logs });
  } catch (error) {
    return c.json({ error: 'Failed to fetch activity logs' }, 500);
  }
});

// GET /activity-logs - Get all activity logs (admin only)
activityLogs.get('/', requireAdmin, async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const logs = await ActivityLogService.getAllActivityLogs(limit, offset);
    return c.json({ logs });
  } catch (error) {
    return c.json({ error: 'Failed to fetch activity logs' }, 500);
  }
});

// GET /activity-logs/action/:action - Get logs by action
activityLogs.get('/action/:action', requireAdmin, async (c) => {
  const action = c.req.param('action');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const logs = await ActivityLogService.getActivityLogsByAction(action, limit, offset);
    return c.json({ logs });
  } catch (error) {
    return c.json({ error: 'Failed to fetch activity logs' }, 500);
  }
});

// GET /activity-logs/stats - Get activity statistics (admin only)
activityLogs.get('/stats', requireAdmin, async (c) => {
  const startDate = c.req.query('startDate') ? new Date(c.req.query('startDate')!) : undefined;
  const endDate = c.req.query('endDate') ? new Date(c.req.query('endDate')!) : undefined;

  try {
    const stats = await ActivityLogService.getActivityStats(startDate, endDate);
    return c.json({ stats });
  } catch (error) {
    return c.json({ error: 'Failed to fetch activity statistics' }, 500);
  }
});

// DELETE /activity-logs/clean - Clean old logs (admin only)
activityLogs.delete('/clean', requireAdmin, async (c) => {
  const daysToKeep = parseInt(c.req.query('days') || '90');

  try {
    const result = await ActivityLogService.cleanOldLogs(daysToKeep);
    return c.json({ deleted: result.count });
  } catch (error) {
    return c.json({ error: 'Failed to clean old logs' }, 500);
  }
});

export default activityLogs;
