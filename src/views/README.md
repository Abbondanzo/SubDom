# A Short Monologue on Client-Side Code

I spent several days working on this project--several more days than I intended--but I learned a helluva lot about Deno: its strengths, its shortcomings, its purpose. If there's one thing that I found smashing my head in at every corner, it's that Deno is not designed to serve static assets from libraries. It's as simple as that.

The beauty of this particular application is that it's intentionally a piece of garbage. I am not condoning launching this as a paid service (nor would I with most of these projects). That's why I can get away with writing something horrible JavaScript that gets served alongside these templates and not go with `[insert popular framework name here]` for state management.

I wanted to make this project stand the test of time and get to point the finger solely at Deno when it stops working, rather than hacking in some garbage like [I tried to with React](https://github.com/Abbondanzo/SubDom/pull/2). This is all despite the fact that I'm a web developer, and the only reason I was put on this Earth was to find creative ways to serve HTML without actually writing any HTML. It doesn't always work out that way.

I tried several different things to get this project to work beyond this shitty copy and paste effort, but alas modern programmers need only know how to copy and paste. So, I've written up a few of my attempts below and explanations to why they all suck. Enjoy.

## Declare the entirety of the HTML document as a constant

This step would ensure that your static files are always accessible, rather than fetching at runtime. In most cases, applications spend their effort converting from `.ts` to `html`, not the reverse. I could spend another 36 hours writing some beautiful scripts that generate proper HTML into a `.ts` file from these templates, but I didn't. If you think I should have, file a PR with your attempt at it. After all, many companies already do this with ~~free unpaid labor~~ coding challenges.

## Template fetching on runtime

This was something I heavily considered. I still might do that after I finish writing this monologue. But in all honesty, it's just a glorified version of serving static assets.

The concept itself is simple--a template file can be defined as such in Deno:

```typescript
import { dirname } from "https://deno.land/std@0.65.0/path/mod.ts";
import { renderToString } from "https://deno.land/x/dejs@0.8.0/mod.ts";

const __dirname = dirname(import.meta.url);
const templateCache = {};

const getTemplate = async (templateName: string) => {
  if (!templateCache[templateName]) {
    // Only call fetch if not a local file
    if (__dirname.startsWith("file:")) {
      const file = await import(`${__dirname}/${templateName}.ejs`);
      templateCache[templateName] = file;
    } else {
      const body = await fetch(`${__dirname}/${templateName}.ejs`);
      templateCache[templateName] = await body.text();
    }
  }
  return templateCache[templateName];
};

export const getIndex = async () => {
  const template = await getTemplate("index");
  return await renderToString(template, { foo: "bar" });
};
```

With an extra bit of effort, we could absolutely do this. The larger issue at hand is that the application would still have to fetch templates each time you spin it up. Fetching random files at runtime can be unreliable, we can't rely on GitHub's 50% uptime. So, we'd need to add an initialization step for each of the templates. Again, not necessarily a problem, but is more reliably solved with defined constants.

## Separate frontend from server

This one I didn't try, but I think it has some promise. Despite the fact that Deno manages dependencies on runtime, a frontend application doesn't have that same luxury. Inside a separate project (or nested deeply in your own), you can build out a frontend project (say, using `create-react-app` as a starting point).

Once you're ready to deploy this library, you'd transpile your code down into one directory and point your Express (Opine) server at it. Yes, this entirely defeats the purpose of relying on Deno over NPM, but at least users of your library won't have to use NPM.

## Serving React

I gave this a try, and failed. Then I gave it another tried. And I failed again. And I followed example after example but what I came to realize is that the ecosystem is not stable enough to support such a feat. Just take a look at [Opine's example of using React](https://github.com/asos-craigmorten/opine/tree/main/examples/react). Note the subtext:

> Unfortunately template rendering does not currently support remote URLs for views, so this example cannot be run directly from this repo.

I thought I could hack my way around that, and I was almost able to. I took a look at that [same developer's example project](https://github.com/asos-craigmorten/deno-react-base-server) and was able to get it working with one large caveat: once you want to import any component other than your entrypoint, you cannot access that other component in memory.

Let's use the following example, a snippet of code from my [React branch](https://github.com/Abbondanzo/SubDom/blob/f1621e25aaf0357df93d2797f4dd5cd128b345cb/src/components/server.tsx):

```typescript
const browserBundlePath = "/browser.js";
const { default: App } = await import("./App.tsx");

const js = `
    import React from "https://dev.jspm.io/react@16.13.1";
    import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
    const App = ${App};
    const baseUrl = "${baseUrl}";
    ReactDOM.hydrate(React.createElement(App, { baseUrl }), document.getElementById("react-root"));`;
```

I need to serve that code, so I add this little bit here:

```typescript
router.route(browserBundlePath).get((_: Request, res: Response) => {
  res.type("application/javascript").send(js);
});
```

And finally, the most important bit, I need to serve some HTML with that script:

```typescript
const ssr = ReactDOMServer.renderToString(<App />);
const html = `
    <html>
      <head>
        <script type="module" src="${browserBundlePath}"></script>  
      </head>
      <body>
        <div id="react-root">
          ${ssr}
        </div>
      </body>
    </html>`;

router.route("/").get((_: Request, res: Response) => {
  res.type("text/html").send(html);
});
```

There we have it. I have a module script (which means support for imports) and a working example of my little app. I used the cute little example from the example project linked above just to test that state worked.

But there's one important line that makes all the difference and that is:

> `const { default: App } = await import("./App.tsx");`

When you call this method
