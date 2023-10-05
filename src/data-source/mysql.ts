// import "reflect-metadata";
import { DataSource } from "typeorm";
// import { Employee } from "./entity/Employee";
require("dotenv").config();
const dir = __dirname;
console.log("dir", dir);

export const MysqlDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: parseInt(process.env.MYSQL_PORT) || 3308,
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "mammothz123",
  database: process.env.MYSQL_DATABASE || "datapro_test",
  synchronize: true,
  logging: true,
  entities: [dir + "/../entities/mysql/**/*{.ts,.js}"],
  migrations: [dir + "/../migrations/mysql/**/*{.ts,.js}"],
  subscribers: [],
});
