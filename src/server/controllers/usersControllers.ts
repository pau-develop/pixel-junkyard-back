import Debug from "debug";
import chalk from "chalk";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createToken, hashCompare, hashCreator } from "../../utils/auth";
import createCustomError from "../../utils/createCustomError";
import {
  loginSchema,
  registerSchema,
} from "../../database/schemas/validationSchemas";
import { IUser, LoginData, RegisterData } from "../../interfaces/interfaces";
import User from "../../database/models/User";

const debug = Debug("pixel-junkyard:usersControllers");

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Creating user..."));
  const user: RegisterData = req.body;

  try {
    const validation = registerSchema.validate(user, {
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

    user.password = await hashCreator(user.password);

    await User.create({
      userName: user.userName,
      password: user.password,
      email: user.email,
    });
    const message = "User registered!";
    res.status(201).json({ message });
  } catch (error) {
    const customError = createCustomError(404, error.message);
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Attempting to log in..."));
  const user = req.body as LoginData;

  let findUsers: Array<IUser>;
  try {
    const validation = loginSchema.validate(user, {
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

    findUsers = await User.find({ userName: user.userName });
    if (findUsers.length === 0) {
      debug(chalk.bgRed("User not found"));
      const customError = createCustomError(404, "ERROR! User not found");
      next(customError);
      return;
    }
  } catch (error) {
    const customError = createCustomError(404, error.message);
    next(customError);
    return;
  }

  const isPasswordValid = await hashCompare(
    user.password,
    findUsers[0].password
  );
  if (!isPasswordValid) {
    debug(chalk.bgRed("Wrong password!"));
    const customError = createCustomError(
      404,
      "Incorrect user name or password"
    );
    next(customError);
    return;
  }

  const payLoad: JwtPayload = {
    _id: findUsers[0]._id,
    userName: findUsers[0].userName,
  };
  debug(payLoad);
  const responseData = {
    user: {
      token: createToken(payLoad),
    },
  };
  debug(responseData);

  res.status(200).json(responseData);
};
