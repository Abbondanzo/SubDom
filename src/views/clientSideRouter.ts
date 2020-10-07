import { join, Request, Response, Router, serveStatic } from "../../deps.ts";

const SCRIPT_PATH = "/constants.js";
const PUBLIC_ASSETS = "public";

export const clientSideRouter = (
  constants: { [key: string]: string },
) => {
  // Declare each value as a separate global constant
  const constantsMap = Object.keys(constants).map((constantName) => {
    const constantValue = JSON.stringify(constants[constantName]);
    return `const ${constantName} = ${constantValue};`;
  }).join("\n");

  const router = new Router();

  router.route("*").get(serveStatic(PUBLIC_ASSETS));

  router.route(SCRIPT_PATH).get((_: Request, response: Response) => {
    response.type("application/javascript").send(constantsMap);
  });

  router.route("/").get((_: Request, response: Response) => {
    const fullPath = join(PUBLIC_ASSETS, "index.html");
    response.sendFile(fullPath);
  });

  router.route("*").get((_: Request, response: Response) => {
    const fullPath = join(PUBLIC_ASSETS, "404.html");
    response.sendFile(fullPath);
  });
};
