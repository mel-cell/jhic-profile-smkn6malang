import { Hono } from 'hono';
import { z } from 'zod';
import { UserSettingService } from '../services/userSettingService';
import { authenticate } from '../middlewares/auth';

const settings = new Hono();

const updateSettingsSchema = z.record(z.string(), z.string());

// GET /settings - Get user settings
settings.get('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const userSettings = await UserSettingService.getUserSettings(user.id);
    return c.json({ settings: userSettings });
  } catch (error) {
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// GET /settings/:key - Get specific setting
settings.get('/:key', authenticate, async (c) => {
  const user = c.get('user');
  const key = c.req.param('key');

  try {
    const value = await UserSettingService.getUserSetting(user.id, key);
    return c.json({ key, value });
  } catch (error) {
    return c.json({ error: 'Failed to fetch setting' }, 500);
  }
});

// PUT /settings/:key - Set specific setting
settings.put('/:key', authenticate, async (c) => {
  const user = c.get('user');
  const key = c.req.param('key');

  try {
    const body = await c.req.json();
    const value = z.string().parse(body.value);

    const setting = await UserSettingService.setUserSetting(user.id, key, value);
    return c.json({ setting });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update setting' }, 500);
  }
});

// PUT /settings - Set multiple settings
settings.put('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = updateSettingsSchema.parse(body);

    const settings = await UserSettingService.setUserSettings(user.id, validated);
    return c.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// DELETE /settings/:key - Delete setting
settings.delete('/:key', authenticate, async (c) => {
  const user = c.get('user');
  const key = c.req.param('key');

  try {
    await UserSettingService.deleteUserSetting(user.id, key);
    return c.json({ message: 'Setting deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete setting' }, 500);
  }
});

// POST /settings/initialize - Initialize default settings
settings.post('/initialize', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const settings = await UserSettingService.initializeUserSettings(user.id);
    return c.json({ settings }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to initialize settings' }, 500);
  }
});

export default settings;
