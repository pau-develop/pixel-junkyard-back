import express from "express";
import getAllDrawings, {
  createDrawing,
  deleteDrawing,
  getDrawingById,
  updateDrawing,
} from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";

const drawingsRouter = express.Router();

drawingsRouter.get("/all", tokenVerification, getAllDrawings);
drawingsRouter.get("/:id", tokenVerification, getDrawingById);
drawingsRouter.post("/create", tokenVerification, createDrawing);
drawingsRouter.delete("/delete/:drawingId", tokenVerification, deleteDrawing);
drawingsRouter.post("/update/:drawingId", tokenVerification, updateDrawing);

export default drawingsRouter;
