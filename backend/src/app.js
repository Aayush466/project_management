import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
