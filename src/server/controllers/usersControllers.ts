import Debug from "debug";
import chalk from "chalk";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createToken, hashCompare, hashCreator } from "../../utils/auth";
import createCustomError from "../../utils/createCustomError";
import registerSchema from "../../database/schemas/validationSchemas";
import { LoginData, RegisterData } from "../../interfaces/interfaces";
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

    const newUser = await User.create({
      userName: user.userName,
      password: user.password,
      email: user.email,
    });
    res.status(201).json({ user: newUser });
  } catch (error) {
    const customError = createCustomError(404, "ERROR! Username already taken");
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
  let findUsers: Array<LoginData>;
  try {
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
  }

  try {
    debug(`userPass:${user.password},DBuserPass:${findUsers[0].password}`);
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
  } catch (error) {
    const customError = createCustomError(404, error.message);
    next(customError);
  }

  const payLoad: JwtPayload = {
    _id: findUsers[0]._id,
    userName: findUsers[0].userName,
  };

  const responseData = {
    user: {
      token: createToken(payLoad),
    },
  };

  res.status(200).json(responseData);
};
