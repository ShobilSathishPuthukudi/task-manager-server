import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/globalErrorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === process.env.CLIENT_URL) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Taskify API is running',
  });
});

app.use(errorHandler);

export default app;
