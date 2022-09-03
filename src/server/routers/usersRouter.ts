import express from "express";
import { getAllUsers } from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get("/all", getAllUsers);

export default usersRouter;
