import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./routers/userRouter";
import customError from "./middlewares/customError";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use(customError);

export default app;
