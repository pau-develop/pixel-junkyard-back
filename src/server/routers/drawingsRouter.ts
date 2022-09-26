import express from "express";
import getAllDrawings, {
  createDrawing,
  deleteDrawing,
  getDrawingById,
} from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";

const drawingsRouter = express.Router();

drawingsRouter.get("/all", tokenVerification, getAllDrawings);
drawingsRouter.get("/:id", tokenVerification, getDrawingById);
drawingsRouter.post("/create", tokenVerification, createDrawing);
drawingsRouter.delete("/delete/:drawingId", tokenVerification, deleteDrawing);

export default drawingsRouter;
