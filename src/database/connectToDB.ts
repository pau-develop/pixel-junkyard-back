import "../loadEnvironment";
import mongoose from "mongoose";
import Debug from "debug";
import chalk from "chalk";

const debug = Debug("pixel-junkyard:database:index");

const connectToDB = (mongUrl: string) => {
  new Promise((resolve, reject) => {
    mongoose.connect(mongUrl, (error) => {
      if (error) {
        debug(chalk.bgRedBright("Error connecting to DB", error.message));
        reject(error);
        return;
      }

      debug(chalk.bgGreenBright("Connected to DB"));
      resolve(true);
    });
  });
};

export default connectToDB;
