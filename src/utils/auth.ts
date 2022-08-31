import "../loadEnvironment";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.SECRET);

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);
