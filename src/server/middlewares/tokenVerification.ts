import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import chalk from "chalk";
import Debug from "debug";
import { verifyToken } from "../../utils/auth";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "./CustomRequest";

const debug = Debug("pixel-junkyard:tokenVerification");

const tokenVerification = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const customError = createCustomError(400, "Authentication error");
  const dataAuthentication = req.get("Authorization");
  debug(chalk.bgBlue(req));
  if (!dataAuthentication || !dataAuthentication.startsWith("Bearer ")) {
    next(customError);
    return;
  }
  const token = dataAuthentication.slice(7);
  let tokenData: JwtPayload | string;
  try {
    tokenData = verifyToken(token);
  } catch {
    const authError = createCustomError(401, "Unable to verify token");
    next(authError);
    return;
  }

  req.payload = tokenData as JwtPayload;
  next();
};

export default tokenVerification;
