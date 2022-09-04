import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
} from "../controllers/usersControllers";
import tokenVerification from "../middlewares/tokenVerification";

const usersRouter = express.Router();

usersRouter.get("/all", tokenVerification, getAllUsers);
usersRouter.get("/:id", tokenVerification, getUserById);
usersRouter.delete("/delete/:id", tokenVerification, deleteUser);

export default usersRouter;
