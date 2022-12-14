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
import { CustomRequest } from "../middlewares/CustomRequest";
import Drawing from "../../database/models/Drawing";

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

    const createdUser = await User.create({
      userName: user.userName,
      password: user.password,
      email: user.email,
      avatar: "???",
    });

    res.status(201).json({ createdUser });
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
    id: findUsers[0].id,
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("fetching all users from DB..."));
  try {
    const users = await User.find({});
    debug(chalk.greenBright(users));
    res.status(200).json({ users });
    debug(chalk.green("Success"));
  } catch {
    const customError = createCustomError(404, "Unable to fetch users");
    next(customError);
  }
};

export const getUserById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  debug(chalk.redBright(id));
  try {
    const user = await User.findById(id).populate({
      path: "drawings",
      model: Drawing,
    });
    debug(chalk.green(user));
    res.status(200).json({ user });
  } catch (error) {
    const customError = createCustomError(404, "Unable to fetch drawings");
    next(customError);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  debug(chalk.blue(`deleting user with id ${id}...`, req.params));

  try {
    const user = await User.findById(id);
    debug(user);
    const deletedUser = await user.deleteOne({ id });
    debug(deletedUser);
    debug(`Deleted robot with ID ${id}`);
    res.status(200).json({ message: `Succesfully deleted the user` });
    next();
  } catch {
    const error = createCustomError(404, `Something went wrong`);
    next(error);
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newAvatar } = req.body;
    const { id } = req.payload;
    debug("hola", newAvatar);
    debug(newAvatar, id);
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { avatar: newAvatar } }
    );
    debug(updatedUser);
    res.status(200).json({ updatedUser });
  } catch (error) {
    const customError = createCustomError(404, "Something went wrong");
    next(customError);
  }
};
