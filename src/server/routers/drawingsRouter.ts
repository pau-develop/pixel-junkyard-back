import express from "express";
import getAllDrawings from "../controllers/drawingsControllers";
import tokenVerification from "../middlewares/tokenVerification";

const drawingsRouter = express.Router();

drawingsRouter.post("/all", tokenVerification, getAllDrawings);

export default drawingsRouter;
