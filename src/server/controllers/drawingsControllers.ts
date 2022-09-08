import Debug from "debug";
import chalk from "chalk";
import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import createCustomError from "../../utils/createCustomError";
import { IDrawing } from "../../interfaces/interfaces";
import { createDrawingSchema } from "../../database/schemas/validationSchemas";

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Creating drawing..."));
  const drawing: IDrawing = req.body;

  try {
    const validation = createDrawingSchema.validate(drawing, {
      abortEarly: false,
    });

    if (validation.error) {
      const customError = createCustomError(
        404,
        Object.values(validation.error.message).join("")
      );
      next(customError);
      return;
    }

    const createdDrawing = await Drawing.create({
      name: drawing.name,
      description: drawing.description,
      image: drawing.image,
      artist: drawing.artist,
      resolution: drawing.resolution,
      userId: drawing.userId,
    });

    res.status(201).json(createdDrawing);
    debug(res);
  } catch (error) {
    const customError = createCustomError(404, error.message);
    next(customError);
  }
};

export default getAllDrawings;
