import express from "express";
import morgan from "morgan";
import cors from "cors";

import usersRouter from "./routers/usersRouter";
import customError from "./middlewares/customError";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use(customError);

export default app;
