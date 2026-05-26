import 'dotenv/config';
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

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/feed', feedRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Subfreq API running on :${PORT}`);
});
