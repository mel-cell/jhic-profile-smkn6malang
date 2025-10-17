import { Hono } from 'hono';
import { z } from 'zod';
import { PortfolioService } from '../services/portfolioService';
import { authenticate } from '../middlewares/auth';
import prisma from '../config/database';
  
const portfolios = new Hono();

const createPortfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  filePath: z.string().optional(),
  fileType: z.string().optional(),
  url: z.string().url().optional(),
  isPublic: z.boolean().optional(),
});

// GET /portfolios/public - Get public portfolios
portfolios.get('/public', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const portfolios = await PortfolioService.getPublicPortfolios(limit, offset);
    return c.json({ portfolios });
  } catch (error) {
    return c.json({ error: 'Failed to fetch public portfolios' }, 500);
  }
});

// GET /portfolios/search - Search portfolios
portfolios.get('/search', async (c) => {
  const query = c.req.query('q');
  if (!query) {
    return c.json({ error: 'Query parameter required' }, 400);
  }

  try {
    const portfolios = await PortfolioService.searchPortfolios(query);
    return c.json({ portfolios });
  } catch (error) {
    return c.json({ error: 'Failed to search portfolios' }, 500);
  }
});

// GET /portfolios/my - Get user's portfolios
portfolios.get('/my', authenticate, async (c) => {
  const user = c.get('user');
  const isPublicOnly = c.req.query('public') === 'true';

  try {
    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ portfolios: [] });
    }

    const portfolios = await PortfolioService.getStudentPortfolios(studentProfile.id, isPublicOnly);
    return c.json({ portfolios });
  } catch (error) {
    return c.json({ error: 'Failed to fetch portfolios' }, 500);
  }
});

// POST /portfolios - Create portfolio
portfolios.post('/', authenticate, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();
    const validated = createPortfolioSchema.parse(body);

    // Get student profile from user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });
    if (!studentProfile) {
      return c.json({ error: 'Student profile not found' }, 404);
    }

    const portfolio = await PortfolioService.createPortfolio({
      ...validated,
      studentProfileId: studentProfile.id,
    });

    return c.json({ portfolio }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to create portfolio' }, 500);
  }
});

// GET /portfolios/:id - Get portfolio by ID
portfolios.get('/:id', async (c) => {
  const portfolioId = c.req.param('id');

  try {
    const portfolio = await PortfolioService.getPortfolioById(portfolioId);
    if (!portfolio) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }
    return c.json({ portfolio });
  } catch (error) {
    return c.json({ error: 'Failed to fetch portfolio' }, 500);
  }
});

// PUT /portfolios/:id - Update portfolio
portfolios.put('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const portfolioId = c.req.param('id');

  try {
    const body = await c.req.json();
    const validated = createPortfolioSchema.partial().parse(body);

    const portfolio = await PortfolioService.updatePortfolio(portfolioId, validated);
    return c.json({ portfolio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update portfolio' }, 500);
  }
});

// DELETE /portfolios/:id - Delete portfolio
portfolios.delete('/:id', authenticate, async (c) => {
  const user = c.get('user');
  const portfolioId = c.req.param('id');

  try {
    await PortfolioService.deletePortfolio(portfolioId);
    return c.json({ message: 'Portfolio deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete portfolio' }, 500);
  }
});

export default portfolios;
