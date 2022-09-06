import express from "express";
import getAllDrawings, {
  getDrawingById,
} from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";

const drawingsRouter = express.Router();

drawingsRouter.get("/all", tokenVerification, getAllDrawings);
drawingsRouter.get("/:id", tokenVerification, getDrawingById);

export default drawingsRouter;
