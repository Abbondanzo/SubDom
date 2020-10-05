import { Request, Response, Router as ServerRouter } from "../deps.ts";
import { RedirectProxy } from "./redirectProxy.ts";

const handleIndex = (request: Request, response: Response) => {
  console.log(
    `${new Date()} - Received request from ${request.conn.remoteAddr} - ${request.hostname}`,
  );
  return response.send("Hello world");
};

export const setupRouter = (redirectProxy: RedirectProxy) => {
  const router = new ServerRouter();

  // Attempt to handle redirect host or call next handler
  router.get("*", (request: Request, response: Response, next) => {
    const host = request.headers.get("host") || "";
    const redirect = redirectProxy.getRedirect(host);
    if (redirect) {
      console.log(`Found redirect: ${redirect}`);
      response.redirect(redirect);
    } else {
      return next();
    }
  });
  // Handle requests for setup
  router.get("/", handleIndex);

  return router;
};
