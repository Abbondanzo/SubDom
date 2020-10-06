import {
  NextFunction,
  Request,
  Response,
  Router as ServerRouter,
} from "../deps.ts";
import { RedirectProxy } from "./redirectProxy.ts";

let _redirectProxy: RedirectProxy;

const handleRedirect = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const host = request.headers.get("host") || "";
  const redirect = _redirectProxy.getRedirect(host);
  if (redirect) {
    console.log(`Found redirect: ${redirect}`);
    response.redirect(redirect);
  } else {
    return next();
  }
};

const handleIndex = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (
    !_redirectProxy.matchesBaseUrl(request.hostname) ||
    request.originalUrl !== "/"
  ) {
    return next();
  }
  const host = request.headers.get("Host");
  const hostname = request.hostname;
  console.log(
    `${new Date()} - Received request from ${host} - ${hostname}`,
  );
  return response.render("index", { baseUrl: _redirectProxy.getBaseUrl() });
};

const handle404 = (_: Request, response: Response) => {
  response.setStatus(404).render(
    "404",
    { baseUrl: _redirectProxy.getBaseUrl() },
  );
};

export const setupRouter = (redirectProxy: RedirectProxy) => {
  const router = new ServerRouter();
  _redirectProxy = redirectProxy;

  // Attempt to handle redirect host or call next handler
  router.get("*", handleRedirect);
  // Handle requests for setup
  router.route("/").get(handleIndex);
  // Fallback to 404 error
  router.get("*", handle404);

  return router;
};
