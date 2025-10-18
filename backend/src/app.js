import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


export const app = express();

app.use(cors())

app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded())

app.use(cookieParser())

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

// export { app };