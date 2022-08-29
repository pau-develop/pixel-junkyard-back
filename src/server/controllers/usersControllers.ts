import Debug from "debug";
import chalk from "chalk";
import { Request, Response, NextFunction } from "express";
import User, { UserData } from "../../database/models/User";

const debug = Debug("social-network:usersControllers");

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  debug(chalk.blue("Creating user..."));
  const user: UserData = req.body;

  debug(chalk.blue(`password:${user.password}`));
  try {
    const newUser = await User.create(user);
    res.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
};

export default createUser;
