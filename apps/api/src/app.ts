import { IDIContainer } from "rsdi/dist/types";
import { Server } from "./server";

export class TrainixApi {
  server?: Server;
  diContainer: IDIContainer;

  async start() {
    const port = process.env.PORT || "5000";
    this.server = new Server(port);
    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    return this.server?.stop();
  }
}
