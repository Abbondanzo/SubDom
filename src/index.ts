import {
  dirname,
  join,
  opine,
  renderFileToString,
  serveStatic,
} from "../deps.ts";
import { SubDomConfig } from "../mod.ts";
import { RedirectProxy } from "./redirectProxy.ts";
import { AppRouter } from "./router.ts";

const DEFAULT_PORT = 4300;
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

  const options: Required<SubDomConfig> = { ...defaultOptions, ...userOptions };

  // Use redirect proxy for determining what to do with hosts
  const redirectProxy = new RedirectProxy(
    { ...options, onError: console.error },
  );

  // Setup view engine
  app.set("view engine", VIEW_ENGINE);
  app.set("views", VIEWS_URL);
  app.engine("ejs", renderFileToString);

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
