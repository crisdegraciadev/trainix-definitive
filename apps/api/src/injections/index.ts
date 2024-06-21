import { ContainerBuilder } from "node-dependency-injection";
import { INJECTIONS } from "./application";

const container = new ContainerBuilder();

for (const [key, service] of Object.entries(INJECTIONS)) {
  container.register(key, service);
}

export default container;
