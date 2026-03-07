import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

import apiRoutes from './routes/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Routes
app.use('/api/v1', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
