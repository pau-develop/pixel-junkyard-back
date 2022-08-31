import "../loadEnvironment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.SECRET);

export default hashCreator;
