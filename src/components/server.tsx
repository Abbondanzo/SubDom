import {
  React,
  ReactDOMServer,
  Request,
  Response,
  Router,
} from "../../deps.ts";

const browserBundlePath = "/browser.js";
const { default: App } = await import("./App.tsx");

const getErrorPage = (baseUrl: string) =>
  `
<!DOCTYPE html>
<html>
  <head>
    <title>404 - Redirect Not Found</title>
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body class="error-container">
    <div>
      <h1>404</h1>
      <p>
        I'm afraid there's nothing here, but maybe you can <a href="${baseUrl}">change that</a>.
      </p>
    </div>
  </body>
</html>
`;

export const setupReactServer = (baseUrl: string) => {
  const router = new Router();

  const js = `
    import React from "https://dev.jspm.io/react@16.13.1";
    import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
    const App = ${App};
    ReactDOM.hydrate(React.createElement(App), document.getElementById("react-root"));`;

  const html = `
    <html>
      <head>
        <script type="module" src="${browserBundlePath}"></script>  
      </head>
      <body>
        <div id="react-root">
          ${(ReactDOMServer as any).renderToString(<App />)}
        </div>
      </body>
    </html>`;

  router.route(browserBundlePath).get((_: Request, res: Response) => {
    res.type("application/javascript").send(js);
  });

  router.route("/").get((_: Request, res: Response) => {
    res.type("text/html").send(html);
  });

  router.route("*").get((_: Request, res: Response) => {
    res.type("text/html").send(getErrorPage(baseUrl));
  });

  return router;
};
