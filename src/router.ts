import {
  NextFunction,
  Request,
  Response,
  Router,
  RouterType,
} from "../deps.ts";

import { RedirectProxy } from "./redirectProxy.ts";

export class AppRouter {
  private readonly redirectProxy: RedirectProxy;
  private readonly router: RouterType;

  constructor(redirectProxy: RedirectProxy) {
    this.redirectProxy = redirectProxy;
    this.router = new Router();

    this.router.route("*").get(this.handleRedirect);
    this.router.route("/").get(this.handleIndex);
    //   this.router.route("/api").all();
    this.router.route("*").get(this.handle404);
  }

  public getModem() {
    return this.router;
  }

  /**
 * Perform redirect if the determined subdomain is handled by this application.
 * 
 * @param request used to determine the subdomain to redirect to
 * @param response write redirects
 * @param next called if no subdomain is passed in
 */
  private handleRedirect = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const host = request.headers.get("Host") || "";
    const redirect = this.redirectProxy.getRedirect(host);
    if (redirect) {
      console.log(`Found redirect: ${redirect}`);
      response.redirect(redirect);
    } else {
      return next();
    }
  };

  /**
   * Serve the HTML form you'd use to set subdomains. 
   * 
   * @param request 
   * @param response 
   * @param next called if the hostname does not match the configured base URL
   */
  private handleIndex = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const host = request.headers.get("Host") || "";
    if (
      !this.redirectProxy.matchesBaseUrl(host) ||
      request.originalUrl !== "/"
    ) {
      return next();
    }
    return response.render(
      "index",
      { baseUrl: this.redirectProxy.getBaseUrl() },
    );
  };

  /**
   * Handle "unhandled" application routes by serving a simple 404 page with a link to index.
   * 
   * @param _ request
   * @param response write a 404 body to this response
   */
  private handle404 = (_: Request, response: Response) => {
    response.setStatus(404).render(
      "404",
      { baseUrl: this.redirectProxy.getBaseUrl() },
    );
  };
}
