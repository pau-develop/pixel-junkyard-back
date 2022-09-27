import Debug from "debug";
import chalk from "chalk";
import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import createCustomError from "../../utils/createCustomError";
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
    const { offset, limit, resolution } = req.query;

    debug(chalk.bgBlueBright(offset, limit, resolution));
    debug(resolution);
    let totalDocs;
    let drawings;
    if (resolution === undefined) {
      debug("pasa per aqui");
      drawings = await Drawing.find({})
        .skip(offset as unknown as number)
        .limit(limit as unknown as number);
      totalDocs = await Drawing.countDocuments();
    } else {
      drawings = await Drawing.find({ resolution })
        .skip(offset as unknown as number)
        .limit(limit as unknown as number);
      totalDocs = await Drawing.countDocuments({ resolution });
    }
    res.status(200).json({ drawings, totalDocs });
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
    const drawing = await Drawing.findById(id).populate({
      path: "artist",
      model: User,
    });
    debug(chalk.greenBright(drawing));
    res.status(200).json({ drawing });
    debug(chalk.green("Success"));
  } catch (error) {
    const customError = createCustomError(404, "Something went wrong");
    next(customError);
  }
};

export const createDrawing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Creating drawing..."));
  const drawing = req.body;
  debug(chalk.bgCyan(drawing.artistName));
  const user = req.payload;
  debug(chalk.greenBright(user.userName));

  try {
    const validation = createDrawingSchema.validate(drawing, {
      abortEarly: false,
    });

    if (validation.error) {
      const customError = createCustomError(
        405,
        `Name must be 3 to 12 characters long,
      descripion length cannot surpass 100 characters`
      );
      next(customError);
      return;
    }

    const newDrawing = await Drawing.create({
      name: drawing.name,
      description: drawing.description,
      image: drawing.image,
      artist: user.id,
      artistName: drawing.artistName,
      resolution: drawing.resolution,
      creationDate: drawing.creationDate,
      likes: [],
      dislikes: [],
    });

    const foundUser = await User.findById(user.id);
    debug(chalk.bgRed(foundUser));

    foundUser.drawings.push(newDrawing.id);
    foundUser.save();

    res.status(201).json({ message: "Drawing created!" });
  } catch (error) {
    const customError = createCustomError(406, "Something went wrong");
    next(customError);
  }
};

export const deleteDrawing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { drawingId } = req.params;
  const { id } = req.payload;
  debug(`drawingId:${drawingId},userId:${id}`);

  try {
    const result = await Drawing.deleteOne({ _id: drawingId });
    debug(result);
    await User.findOneAndUpdate(
      { _id: id },
      { $pull: { drawings: drawingId } }
    );

    res.status(200).json({
      message: `Succesfully deleted the drawing with ID ${drawingId}`,
    });
    next();
  } catch (error) {
    const customError = createCustomError(404, "Something went wrong");
    next(customError);
  }
};

export const updateDrawing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { drawingId } = req.params;
  const { id } = req.payload;
  const { isLike } = req.body;
  debug(chalk.bgCyan(drawingId, id, isLike));

  try {
    if (isLike === "true") {
      await Drawing.findOneAndUpdate(
        { _id: drawingId },
        { $push: { likes: id } }
      );
      await Drawing.findOneAndUpdate(
        { _id: drawingId },
        { $pull: { dislikes: id } }
      );
      res.status(200).json("Succesfully liked the drawing");
      return;
    }
    await Drawing.findOneAndUpdate(
      { _id: drawingId },
      { $push: { dislikes: id } }
    );
    await Drawing.findOneAndUpdate(
      { _id: drawingId },
      { $pull: { likes: id } }
    );
    res.status(200).json("Succesfully disliked the drawing");
    return;
  } catch (error) {
    const customError = createCustomError(404, "Something went wrong");
    next(customError);
  }
};

export default getAllDrawings;
