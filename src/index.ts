import { json, opine, serveStatic } from "../deps.ts";
import { SubDomConfig } from "../mod.ts";
import { RedirectProxy } from "./redirectProxy.ts";
import { AppRouter } from "./router.ts";

const defaultOptions: Required<SubDomConfig> = {
  baseUrl: "localhost",
  port: 4300,
  useSSL: true,
  writeToFile: false,
  initialProxies: {},
};

export const setup = (userOptions: SubDomConfig) => {
  const app = opine();

  // Use JSON body-parser for parsing requests
  app.use(json());

  const options: Required<SubDomConfig> = { ...defaultOptions, ...userOptions };

  // Use redirect proxy for determining what to do with hosts
  const redirectProxy = new RedirectProxy(
    { ...options, onError: console.error },
  );

  // Serve static files
  app.use(serveStatic("public"));

  // Configure routes
  const router = new AppRouter(redirectProxy);
  app.use("/", router.getModem());

  // Listen
  const { port } = options;
  console.log(`Listening on port ${port}`);
  app.listen(port);
};
