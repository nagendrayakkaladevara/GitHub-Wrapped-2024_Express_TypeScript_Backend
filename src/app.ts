import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRouter from '../src/routes/userRoutes'

dotenv.config();

// Initialize DB Connection
// connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/', (req, res) => {
//     res.status(200).json({ mes: "welcome" })
// });

app.use('/githubUser', userRouter)

export default app;