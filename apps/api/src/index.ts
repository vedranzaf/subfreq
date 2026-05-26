import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import feedRouter from './routes/feed';
import reviewsRouter from './routes/reviews';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true }));

app.get('/', (_req, res) => res.json({
  name: 'Subfreq API',
  version: '0.1.0',
  status: 'ok',
  endpoints: {
    health: 'GET /health',
    feed: 'GET /api/feed',
    reviews: 'POST /api/reviews',
    upvote: 'POST /api/reviews/:id/upvote',
    comments: 'GET|POST /api/reviews/:id/comments',
    user: 'GET /api/users/:username',
    userReviews: 'GET /api/users/:username/reviews',
    follow: 'POST /api/users/:username/follow',
  },
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/feed', feedRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/users', usersRouter);

// Local dev
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Subfreq API running on :${PORT}`));
}

export default app;
