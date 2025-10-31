import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import boardRoutes from './modules/board/board.routes.js';
import listRoutes from './modules/list/list.routes.js';
import cardRoutes from './modules/card/card.routes.js';
import errorHandler from './middleware/error.middleware.js';
import environmentVariables from './config/env.js';

const app = express();

app.use(cors({origin: environmentVariables.corsOrigin, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

app.use(errorHandler);

export default app;
