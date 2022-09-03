import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { verifyToken } from "../../utils/auth";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "./CustomRequest";

const tokenVerification = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const customError = createCustomError(404, "Authentication error");
  const dataAuthentication = req.get("Authorization");
  if (!dataAuthentication || !dataAuthentication.startsWith("Bearer ")) {
    next(customError);
    return;
  }
  const token = dataAuthentication.slice(7);
  let tokenData: JwtPayload | string;
  try {
    tokenData = verifyToken(token);
  } catch (error) {
    next(error);
    return;
  }

  if (typeof tokenData === "string") {
    next(customError);
    return;
  }
  req.payload = tokenData as JwtPayload;
  next();
};

export default tokenVerification;
