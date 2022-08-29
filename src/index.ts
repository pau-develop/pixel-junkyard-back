import "./loadEnvironment";
import startServer from "./server/startServer";

const port = +process.env.PORT || 4000;

(async () => {
  try {
    await startServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
