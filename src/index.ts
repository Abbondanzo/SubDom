import {
  dirname,
  join,
  json,
  opine,
  renderFileToString,
  serveStatic,
} from "../deps.ts";
import { SubDomConfig } from "../mod.ts";
import { RedirectProxy } from "./redirectProxy.ts";
import { AppRouter } from "./router.ts";
import { renderApp } from "./components/server.ts";

const VIEW_ENGINE = "ejs";
const VIEWS_URL = join(dirname(import.meta.url), "views");

const defaultOptions: Required<SubDomConfig> = {
  baseUrl: "localhost",
  port: 4300,
  useSSL: true,
  writeToFile: false,
  initialProxies: {},
};

export const setup = (userOptions: SubDomConfig) => {
  const app = opine();

  console.log(renderApp());

  // Use JSON body-parser for parsing requests
  app.use(json());

  const options: Required<SubDomConfig> = { ...defaultOptions, ...userOptions };

  // Use redirect proxy for determining what to do with hosts
  const redirectProxy = new RedirectProxy(
    { ...options, onError: console.error },
  );

  // Setup view engine
  app.engine(".ejs", renderFileToString);
  app.set("view engine", VIEW_ENGINE);
  app.set("views", VIEWS_URL);

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
