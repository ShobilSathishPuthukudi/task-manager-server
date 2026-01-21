import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

//Middleware
app.use(cors);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Taskify API is running');
});

export default app;
