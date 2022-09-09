import Debug from "debug";
import chalk from "chalk";
import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import createCustomError from "../../utils/createCustomError";
import { IDrawing } from "../../interfaces/interfaces";
import { createDrawingSchema } from "../../database/schemas/validationSchemas";
import { CustomRequest } from "../middlewares/CustomRequest";
import User from "../../database/models/User";

const debug = Debug("pixel-junkyard:drawingsControllers");

const getAllDrawings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("fetching all drawings from DB..."));
  try {
    const drawings = await Drawing.find({});
    debug(chalk.greenBright(drawings));
    res.status(200).json({ drawings });
    debug(chalk.green("Success"));
  } catch {
    const customError = createCustomError(404, "Unable to fetch drawings");
    next(customError);
  }
};

export const getDrawingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  debug(chalk.blue(`fetching drawing with id ${id}...`, req.params));

  try {
    const drawing = await Drawing.findById(id);
    debug(chalk.greenBright(drawing));
    res.status(200).json({ drawing });
    debug(chalk.green("Success"));
  } catch {
    const customError = createCustomError(404, "Unable to fetch drawing");
    next(customError);
  }
};

export const createDrawing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Creating drawing..."));
  const drawing: IDrawing = req.body;
  const user = req.payload;
  debug(chalk.greenBright(user._id));

  try {
    const validation = createDrawingSchema.validate(drawing, {
      abortEarly: false,
    });

    if (validation.error) {
      const customError = createCustomError(
        405,
        Object.values(validation.error.message).join("")
      );
      next(customError);
      return;
    }

    const newDrawing = await Drawing.create({
      name: drawing.name,
      description: drawing.description,
      image: drawing.image,
      artist: user._id,
      resolution: drawing.resolution,
    });

    const foundUser = await User.findById(user._id);
    debug(chalk.bgRed(foundUser, newDrawing.id));
    foundUser.drawings.push(newDrawing.id);
    foundUser.save();

    res.status(201).json({ message: "Drawing created!" });
  } catch (error) {
    const customError = createCustomError(406, "Something went wrong");
    next(customError);
  }
};

export const getUserDrawings = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  debug(chalk.redBright(id));
  try {
    const drawings = await User.findById(id).populate({
      path: "drawings",
      model: Drawing,
    });
    debug(chalk.green(drawings));
    res.status(200).json({ drawings });
  } catch (error) {
    const customError = createCustomError(404, error.message);
    next(customError);
  }
};

export default getAllDrawings;
