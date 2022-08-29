import chalk from "chalk";
import Debug from "debug";
import app from ".";

const debug = Debug("pixel-junkyard:server:startServer");

const startServer = (port: number) => {
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bgGreenBright(`Server listening on port ${port}`));
      resolve(true);
    });

    server.on("error", (error) => {
      debug(chalk.bgRedBright(`Could not connect to ${port}`));
      reject(error);
    });
  });
};

export default startServer;
