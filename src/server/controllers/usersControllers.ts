import Debug from "debug";
import chalk from "chalk";
import { Request, Response, NextFunction } from "express";
import User, { UserData } from "../../database/models/User";
import hashCreator from "../../utils/auth";
import createCustomError from "../../utils/createCustomError";
import registerSchema from "../../database/schemas/validationSchemas";

const debug = Debug("pixel-junkyard:usersControllers");

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.blue("Creating user..."));
  const user: UserData = req.body;

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
    debug(chalk.blue(`password:${user.password}`));
    const newUser = await User.create(user);
    res.status(201).json({ user: newUser });
  } catch (error) {
    const customError = createCustomError(404, "ERROR! Username already taken");
    next(customError);
  }
};

export default registerUser;
