import { Hono } from 'hono';
import { z } from 'zod';
import { NotificationService } from '../services/notificationService';
import { authenticate } from '../middlewares/auth';

const notifications = new Hono();

const createNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['email', 'in_app', 'push']),
  userId: z.string().uuid().optional(),
  data: z.record(z.unknown()).optional(),
});



// GET /notifications - Get user notifications
notifications.get('/', authenticate, async (c) => {
  const user = c.get('user');
  const userId = user.id;
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const notifications = await NotificationService.getUserNotifications(userId, limit, offset);
    const unreadCount = await NotificationService.getUnreadCount(userId);

    return c.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// POST /notifications - Create notification (admin only)
notifications.post('/', authenticate, async (c) => {
  const user = c.get('user');
  const userId = user.id;
  const role = user.role;

  if (role !== 'ADMIN') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  try {
    const body = await c.req.json();
    const validated = createNotificationSchema.parse(body);

    const notification = await NotificationService.createNotification({
      ...validated,
      userId: validated.userId || userId, // Default to current user if not specified
    });

    return c.json({ notification }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to create notification' }, 500);
  }
});

// PATCH /notifications/:id/read - Mark as read
notifications.patch('/:id/read', authenticate, async (c) => {
  const user = c.get('user');
  const userId = user.id;
  const id = c.req.param('id');

  try {
    const notification = await NotificationService.markAsRead(id);
    return c.json({ notification });
  } catch (error) {
    return c.json({ error: 'Failed to mark notification as read' }, 500);
  }
});

// PATCH /notifications/read-all - Mark all as read
notifications.patch('/read-all', authenticate, async (c) => {
  const user = c.get('user');
  const userId = user.id;

  try {
    const result = await NotificationService.markAllAsRead(userId);
    return c.json({ updated: result.count });
  } catch (error) {
    return c.json({ error: 'Failed to mark all notifications as read' }, 500);
  }
});

// DELETE /notifications/:id - Delete notification
notifications.delete('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const userId = user.id;
  const id = c.req.param('id');

  try {
    await NotificationService.deleteNotification(id);
    return c.json({ message: 'Notification deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete notification' }, 500);
  }
});

export default notifications;
