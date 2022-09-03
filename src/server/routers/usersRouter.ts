import express from "express";
import { getAllUsers } from "../controllers/usersControllers";
import tokenVerification from "../middlewares/tokenVerification";

const usersRouter = express.Router();

usersRouter.get("/all", tokenVerification, getAllUsers);

export default usersRouter;
