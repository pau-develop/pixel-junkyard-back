import express from "express";
import getAllDrawings, {
  createDrawing,
  getDrawingById,
} from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";

const drawingsRouter = express.Router();

drawingsRouter.get("/all", tokenVerification, getAllDrawings);
drawingsRouter.get("/:id", tokenVerification, getDrawingById);
drawingsRouter.post("/create", tokenVerification, createDrawing);

export default drawingsRouter;
