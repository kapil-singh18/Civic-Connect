import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { corsOptions } from './config/cors.js';
import { errorHandler, notFound } from './middlewares/error.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 400 }));

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Civic Connect' }));
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
