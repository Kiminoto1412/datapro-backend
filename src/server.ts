import App from "@/app";
import Logger from "@/utils/logger";
import { port } from "./utils/config";

const app = new App(parseInt(port.toString()));
app
  .initialize()
  .then(() => {
    app.listen();
  })
  .catch((err) => {
    Logger.error("Failed to start server", err);
  });
