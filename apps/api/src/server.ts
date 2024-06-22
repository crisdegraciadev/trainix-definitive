import express, { Express, Request, Response } from "express";
import { Server as HttpServer } from "http";
import Router from "express-promise-router";
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import helmet from "helmet";
import httpStatus from "http-status";
import { registerRoutes } from "./routes";

export class Server {
  private express: Express;
  private port: string;
  private httpServer?: HttpServer;

  constructor(port: string) {
    this.port = port;
    this.express = express();

    this.setupMiddlewares();
    this.setupRouter();
  }

  private setupMiddlewares() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: "deny" }));
  }

  private setupRouter() {
    const router = Router();
    router.use(errorHandler());
    this.express.use(router);
    registerRoutes(router);

    router.use((err: Error, _req: Request, res: Response, _next: Function) => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    });
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        console.log(
          `Trainix API is running at http://localhost:${this.port} in ${this.express.get("env")} mode`,
        );
        resolve();
      });
    });
  }

  getHTTPServer() {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => (error ? reject(error) : resolve()));
      }

      return resolve();
    });
  }
}
