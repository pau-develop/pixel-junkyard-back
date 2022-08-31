import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import Debug from "debug";
import { CustomError } from "../../interfaces/interfaces";

const debug = Debug("pixel-junkyard:customError");

const customError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  debug(chalk.red(error));

  res.status(error.statusCode).json({ error: error.errorMessage });
};

export default customError;
