import { Hono } from 'hono';
import { z } from 'zod';
import { MessageService } from '../services/messageService';
import { authenticate } from '../middlewares/auth';

const messages = new Hono();

const sendMessageSchema = z.object({
  receiverId: z.string(),
  subject: z.string().optional(),
  content: z.string().min(1),
});

// GET /messages - Get user messages
messages.get('/', authenticate, async (c) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const messages = await MessageService.getUserMessages(user.id, limit, offset);
    const unreadCount = await MessageService.getUnreadCount(user.id);

    return c.json({
      messages,
      unreadCount,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// GET /messages/conversation/:userId - Get conversation with specific user
messages.get('/conversation/:userId', authenticate, async (c) => {
  const user = c.get('user');
  const otherUserId = c.req.param('userId');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const messages = await MessageService.getConversation(user.id, otherUserId, limit, offset);
    return c.json({ messages });
  } catch (error) {
    return c.json({ error: 'Failed to fetch conversation' }, 500);
  }
});

// POST /messages - Send message
messages.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = sendMessageSchema.parse(body);

    const message = await MessageService.sendMessage({
      senderId: user.id,
      ...validated,
    });

    return c.json({ message }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// GET /messages/:id - Get message by ID
messages.get('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const messageId = c.req.param('id');

  try {
    const message = await MessageService.getMessageById(messageId);
    if (!message) {
      return c.json({ error: 'Message not found' }, 404);
    }
    return c.json({ message });
  } catch (error) {
    return c.json({ error: 'Failed to fetch message' }, 500);
  }
});

// PATCH /messages/:id/read - Mark message as read
messages.patch('/:id/read', authenticate, async (c) => {
  const user = c.get('user');
  const messageId = c.req.param('id');

  try {
    const message = await MessageService.markAsRead(messageId);
    return c.json({ message });
  } catch (error) {
    return c.json({ error: 'Failed to mark message as read' }, 500);
  }
});

// PATCH /messages/read-all/:senderId - Mark all messages from sender as read
messages.patch('/read-all/:senderId', authenticate, async (c) => {
  const user = c.get('user');
  const senderId = c.req.param('senderId');

  try {
    const result = await MessageService.markAllAsRead(user.id, senderId);
    return c.json({ updated: result.count });
  } catch (error) {
    return c.json({ error: 'Failed to mark messages as read' }, 500);
  }
});

// GET /messages/contacts - Get message contacts
messages.get('/contacts', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const contacts = await MessageService.getMessageContacts(user.id);
    return c.json({ contacts });
  } catch (error) {
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

// DELETE /messages/:id - Delete message
messages.delete('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const messageId = c.req.param('id');

  try {
    await MessageService.deleteMessage(messageId);
    return c.json({ message: 'Message deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete message' }, 500);
  }
});

export default messages;
