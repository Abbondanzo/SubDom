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

export const setup = (
  { baseUrl, writeToFile, port, initialProxies }: SubDomConfig,
) => {
  const app = opine();

  // Use redirect proxy for determining what to do with hosts
  const redirectProxy = new RedirectProxy(
    { baseUrl, writeToFile, initialProxies: initialProxies || {} },
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
  port = port || DEFAULT_PORT;
  console.log(`Listening on port ${port}`);
  app.listen(port);
};
