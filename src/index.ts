import connectToDB from "./database/connectToDB";
import "./loadEnvironment";
import startServer from "./server/startServer";

const mongoUrl = process.env.DATABASE;
const port = +process.env.PORT || 4000;

(async () => {
  try {
    connectToDB(mongoUrl);
    startServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
