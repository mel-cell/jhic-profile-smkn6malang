import { Hono } from 'hono';
import { authenticate, authorize } from '../middlewares/auth';
import { createNews, updateNews, deleteNews } from '../services/newsService';
import { createPrestasi, updatePrestasi, deletePrestasi } from '../services/prestasiService';
import { createEkskul, updateEkskul, deleteEkskul } from '../services/ekskulService';
import { getAllUsers, updateUserRole, deleteUser, getAllJobPostings, updateJobPostingStatus, getAllApplications } from '../services/adminService';

const router = new Hono();

// Apply authentication and admin middleware to all routes
router.use('*', authenticate);
router.use('*', authorize('ADMIN'));

// User management routes
router.get('/users', async (c) => {
  try {
    const users = await getAllUsers();
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.put('/users/:id/role', async (c) => {
  try {
    const { id } = c.req.param();
    const { role } = await c.req.json();

    if (!['STUDENT', 'COMPANY', 'ADMIN'].includes(role)) {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }

    const result = await updateUserRole(id, { role });
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating user role:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.delete('/users/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await deleteUser(id);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// News routes
router.post('/news', async (c) => {
  try {
    const data = await c.req.json();
    const result = await createNews(data);
    if (result.success) {
      return c.json(result, 201);
    } else {
      return c.json(result, 400);
    }
  } catch (error) {
    console.error('Error creating news:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.put('/news/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const result = await updateNews(id, data);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error updating news:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.delete('/news/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await deleteNews(id);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Prestasi routes
router.post('/prestasi', async (c) => {
  try {
    const data = await c.req.json();
    const result = await createPrestasi(data);
    if (result.success) {
      return c.json(result, 201);
    } else {
      return c.json(result, 400);
    }
  } catch (error) {
    console.error('Error creating prestasi:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.put('/prestasi/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const result = await updatePrestasi(id, data);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error updating prestasi:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.delete('/prestasi/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await deletePrestasi(id);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error deleting prestasi:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.get('/job-postings', async (c) => {
  try {
    const jobs = await getAllJobPostings();
    return c.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.put('/job-postings/:id/status', async (c) => {
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();

    if (!['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].includes(status)) {
      return c.json({ success: false, error: 'Invalid status' }, 400);
    }

    const result = await updateJobPostingStatus(id, status);
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating job posting status:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.get('/applications', async (c) => {
  try {
    const applications = await getAllApplications();
    return c.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Ekskul routes
router.post('/ekskul', async (c) => {
  try {
    const data = await c.req.json();
    const result = await createEkskul(data);
    if (result.success) {
      return c.json(result, 201);
    } else {
      return c.json(result, 400);
    }
  } catch (error) {
    console.error('Error creating ekskul:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.put('/ekskul/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const result = await updateEkskul(id, data);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error updating ekskul:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

router.delete('/ekskul/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await deleteEkskul(id);
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 404);
    }
  } catch (error) {
    console.error('Error deleting ekskul:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

export default router;
