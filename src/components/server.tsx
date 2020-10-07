import {
  React,
  ReactDOMServer,
  Request,
  Response,
  Router,
} from "../../deps.ts";
import App from "./App.tsx";

const browserBundlePath = "/browser.ts";
const { default: js } = await import("./client.tsx");

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

/**
 * Now, you might be reading this part and thinking I've gone batshit. Why in the f*** is he 
 * serving React over a Deno application!?!? Well, you and I have the same question. 
 * 
 * It boils down to Deno's inability to serve static assets (cleanly) in libraries. Under normal 
 * circumstances, I can list the contents of a file directory, but not the contents of a server 
 * URL. Raw GitHub files don't permit this, and that's my package manager.
 * 
 * It spawned out of the need to serve templates. This project initially began with a simple form 
 * template with the EJS engine, and again, I know this isn't the purpose of Deno. But I'm a web 
 * developer and the only reason I was put on this Earth was to find creative ways to serve HTML 
 * without actually writing any HTML.
 * 
 * Alas, I did write HTML. I wrote some horrible JavaScript to go with it to maintain this shoddy 
 * form and it worked really well. Until I wanted to use the library how I intended. You see, when 
 * you call to render a template, Express (or Opine, in this case) will read the entirety of 
 * whatever directory you specify and parse out some file resembling a match to your template. And
 * when you attempt to read a URL as your directory, the whole thing blows up in your face.
 * 
 * So, I was left with a few options. Some, I tried. Some actually worked. None but this one spoke
 * out to me and called to my potential as a React evangelist.
 * 
 * - Declare the entirety of the HTML document as a constant in Typescript so it gets imported and
 *   can still be executed.
 *   - Before you call me a dumba** for having already done this to some extent (see above), I 
 *     found this happy medium where I don't serve 900TB of React on error pages. You're welcome
 * - Fetch the template based on how it resolves, checking whether or not the path is relative, and
 *   caching it in memory.
 *   - This actually works! I'm not ashamed to admit this, but I was pleasantly surprised. It also 
 *     fits some oddly shaped explanation of how Deno works too. Then my power went out while I was
 *     experimenting with this solution and I took that as a sign from our Lord and savior Mark
 *     Zuckerberg himself that the project didn't have enough React in it.
 *   - I wanted to experiment with an even safer version of this, where the file would be 
 *     downloaded rather than just cached, but I realized that this project is a joke and I would 
 *     not get those hours back.
 * - Not serve web pages.
 *   - Job security.
 * - Bow down to the almighty React.
 *   - To be honest, I thought my state management looked like a tangled ball of yarn, whereby I 
 *     made one change and the whole thing blows up in my face. It's stupid to try and emulate 
 *     dynamic forms without having the proper management of state.
 *     - "But, Peter, this is how the world worked before React!" 
 *     - Yes, I know. I relish those days too. But if my web application doesn't serve at least 
 *       96 MB of JavaScript, I'll never get asked to a frontend job interview for the rest of my
 *       life.
 *     - "You know you can write forms without making updates to the page?"
 *     - How else will I get this project to the front page of HN? It has to look flashy and only
 *       consume 10% of my available screen real estate. You can't have one without the other.
 * 
 * @param baseUrl URL of the application this is getting served on
 */
export const setupReactServer = (baseUrl: string) => {
  const router = new Router();

  // const js = `
  //   const App = ${App};
  //   const baseUrl = "${baseUrl}";
  //   ReactDOM.hydrate(React.createElement(App, { baseUrl, isServer: false }), document.getElementById("react-root"));`;

  // const [diagnostics, js] = await Deno.bundle(
  //   "./examples/react/client.tsx",
  //   undefined,
  //   { lib: ["dom", "dom.iterable", "esnext"] },
  // );
  const ssrRender = ReactDOMServer.renderToString(
    <App baseUrl={baseUrl} isServer />,
  );
  const html = `
    <html>
      <head>
        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
        <script type="module" src="${browserBundlePath}"></script>
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <div id="react-root">${ssrRender}</div>
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
