import express from "express";
import { getAllUsers, getUserById } from "../controllers/usersControllers";
import tokenVerification from "../middlewares/tokenVerification";

const usersRouter = express.Router();

usersRouter.get("/all", tokenVerification, getAllUsers);
usersRouter.get("/:id", tokenVerification, getUserById);

export default usersRouter;
