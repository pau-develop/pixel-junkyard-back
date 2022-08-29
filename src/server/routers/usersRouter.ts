import express from "express";
import registerUser from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
