/* Installed Imported Modules */
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { AnyError } from "mongodb";
import cookieParser from "cookie-parser";

/* Custom Imported Modules */
import config from "./config/default";
import db from "./config/connection";
import logger from "./config/logger";
import errorHandler from "./middlewares/errorHandler";
import ErrorResponse from "./classes/errorResponse";
import adminAuthRouter from "./routes/adminAuthRouter";
import userAuthRouter from "./routes/userAuthRouter";
import adminRouter from "./routes/adminRouter";
import userRouter from "./routes/userRouter";

/* Config Variables */
const app = express();
const server = http.createServer(app);
const NAMESPACE = "Server";
const { SERVER_PORT, SERVER_HOST } = config.SERVER;
const { MONGO_HOST, MONGO_DATABASE, MONGO_USER } = config.MONGO;

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  })
);

/* MONGO connection */
db.connect(async (err: AnyError) => {
  if (err) {
    logger.error(NAMESPACE, err.message, err);
  } else {
    logger.info(
      NAMESPACE,
      `MONGO DATABASE:[${MONGO_DATABASE}] connected in HOST:[${MONGO_HOST}] by USER:[${MONGO_USER}]`
    );
  }
});

/* All Api Logs */
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    NAMESPACE,
    ` METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    logger.info(
      NAMESPACE,
      ` METHOD:[${req.method}] - URL:[${req.url}] - STATUS:[${res.statusCode}] - IP:[${req.socket.remoteAddress}]`
    );
  });
  next();
});

/* Routes */
app.use(`/api/v1/auth/admin`, adminAuthRouter);
app.use(`/api/v1/auth/user`, userAuthRouter);
app.use(`/api/v1/admin`, adminRouter);
app.use(`/api/v1/user`, userRouter);

/* 404 Route */
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new ErrorResponse("Not Found", 404));
});

/* Error Handling */
app.use(errorHandler);

/* SERVER listening */
server.listen(SERVER_PORT);
server.on("listening", () => {
  logger.info(
    NAMESPACE,
    `Server listening in HOST:[${SERVER_HOST}] PORT:[${SERVER_PORT}]`
  );
});
