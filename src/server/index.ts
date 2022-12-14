import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./routers/userRouter";
import usersRouter from "./routers/usersRouter";
import customError from "./middlewares/customError";
import drawingsRouter from "./routers/drawingsRouter";

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/users", usersRouter);
app.use("/drawings", drawingsRouter);
app.use(customError);

export default app;
