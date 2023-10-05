require("dotenv").config();
import "reflect-metadata";
import routes from "@/routes";
import Logger from "@/utils/logger";
import dayjs from "dayjs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import buddhistEra from "dayjs/plugin/buddhistEra";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { MysqlDataSource } from "./data-source/mysql";

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public initialize() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectToDatabase();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
        this.initializeDayjs();
        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async connectToDatabase() {
    await MysqlDataSource.initialize()
      .then(async () => {
        Logger.info("Connected to mongo database successfully!");
      })
      .catch((error: any) =>
        Logger.info("Connected to mongo database failed!", error)
      );
  }

  private middlewares() {
    this.app.use(
      cors({
        origin: true,
        allowedHeaders: [
          "*",
          "Authorization",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
          "content-type",
        ],
        optionsSuccessStatus: 200,
      })
    );
    morganBody(this.app, {
      stream: {
        write: (message: any) => Logger.http({ message: message }),
      },
      prettify: false,
      includeNewLine: false,
    });
    this.app.use(morgan("dev"));
    this.app.use(
      bodyParser.urlencoded({
        limit: "1gb",
        extended: true,
        parameterLimit: 50000,
      })
    );
    this.app.use(bodyParser.json({ limit: "1gb" }));
  }

  private routes() {
    this.app.use(routes);
  }

  private exceptionHandler() {
    this.app.use(
      async (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          Logger.error({
            message: {
              status: err.statusCode || 500,
              success: false,
              message: err.message || err || "Unknown",
              stack: err.stack || "",
              payload: err.payload || "unknown",
              code: err?.code || "unknown",
            },
          });
          res.status(err.statusCode || 500).send({
            status: err.status || 400,
            success: false,
            message: err.message || err || "Unknown",
            stack: err.stack || "",
            payload: err.payload,
            code: err?.code,
          } as any);
        } catch (e) {
          Logger.error("Error on error Handler", e);
          next(e);
        }
      }
    );
  }

  private initializeDayjs() {
    dayjs.locale("th");
    dayjs.extend(buddhistEra);
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      Logger.info(`App listening on port ${this.port}`);
    });
    server.setTimeout(1000 * 60 * 60);
  }
}

export default App;
