import { opine } from "../deps.ts";
import { SubDomConfig } from "../mod.ts";
import { RedirectProxy } from "./redirectProxy.ts";
import { setupRouter } from "./router.ts";

const DEFAULT_PORT = 4300;

export const setup = (
  { baseUrl, writeToFile, port, initialProxies }: SubDomConfig,
) => {
  const app = opine();
  // Use redirect proxy for determining what to do with hosts
  const redirectProxy = new RedirectProxy(
    { baseUrl, writeToFile, initialProxies: initialProxies || {} },
  );
  // Configure routes
  const router = setupRouter(redirectProxy);
  app.use("*", router);
  // Setup view engine
  app.set("view engine", "ejs");
  // Listen
  port = port || DEFAULT_PORT;
  console.log(`Listening on port ${port}`);
  app.listen(port);
};
