import {
  dirname,
  NextFunction,
  Request,
  Response,
  Router,
  RouterType,
} from "../deps.ts";
import { RedirectProxy } from "./redirectProxy.ts";

const VIEWS_URL = dirname(import.meta.url) + "/views";
console.log(VIEWS_URL);
console.log(import.meta.url);
console.log(dirname(import.meta.url));

export class AppRouter {
  private readonly redirectProxy: RedirectProxy;
  private readonly router: RouterType;

  constructor(redirectProxy: RedirectProxy) {
    this.redirectProxy = redirectProxy;
    this.router = new Router();

    this.router.route("*").get(this.handleRedirect);
    this.router.route("/api/check/:alias").get(this.handleAliasCheck);
    this.router.route("/api/submit").post(this.handleRedirectSubmit);
    this.router.route("/").get(this.handleIndex);
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
      response.redirect(redirect + request.originalUrl);
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
      {
        baseUrl: this.redirectProxy.getBaseUrl(),
      },
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
      {
        baseUrl: this.redirectProxy.getBaseUrl(),
      },
    );
  };

  /**
   * Checks that a given alias is contained in the redirect proxy, returns JSON body with 
   * `hasAlias` value. If true, there is an existing configuration for the given alias.
   * 
   * @param request contains alias path parameter
   * @param response returns JSON body with `hasAlias` value
   */
  private handleAliasCheck = (request: Request, response: Response) => {
    const { alias } = request.params;
    if (alias === undefined) {
      return this.errorResponse(response, "Missing alias parameter");
    }
    return response.json(
      { hasAlias: this.redirectProxy.hasAlias(alias) },
    );
  };

  /**
   * Takes a given alias and redirect, and saves their value to the proxy if allowed.
   * 
   * @param request contains alias and redirect body
   * @param response returns JSON body with alias and redirect values
   */
  private handleRedirectSubmit = (request: Request, response: Response) => {
    const { alias, redirect } = request.parsedBody;
    if (alias === undefined || redirect === undefined) {
      return this.errorResponse(response, "Missing body parameter");
    }
    if (this.redirectProxy.hasAlias(alias)) {
      return this.errorResponse(
        response,
        "An alias of this value already exists",
      );
    }
    if (alias === "") {
      return this.errorResponse(
        response,
        "You can't use the base URL as the alias",
      );
    }
    const baseUrl = this.redirectProxy.getBaseUrl();
    if (redirect.endsWith(baseUrl)) {
      return this.errorResponse(
        response,
        "You cannot redirect to this website",
      );
    }
    this.redirectProxy.setRedirect(alias, redirect);
    return response.json({ [alias]: redirect });
  };

  private errorResponse(response: Response, message: string) {
    return response.setStatus(400).json({ message });
  }
}
