import multer from "multer";
import express from "express";
import path from "path";
import getAllDrawings, {
  createDrawing,
  deleteDrawing,
  getDrawingById,
} from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";
import imageStorage from "../middlewares/imageStorage";

const uploads = multer({
  dest: path.join("uploads"),
  limits: { fileSize: 5000000 },
});
const drawingsRouter = express.Router();

drawingsRouter.get("/all", tokenVerification, getAllDrawings);
drawingsRouter.get("/:id", tokenVerification, getDrawingById);
drawingsRouter.post(
  "/create",
  uploads.single("file"),
  tokenVerification,
  imageStorage,
  createDrawing
);
drawingsRouter.delete("/delete/:drawingId", tokenVerification, deleteDrawing);

export default drawingsRouter;
