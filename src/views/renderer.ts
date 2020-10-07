import { dirname, renderFileToString } from "../../deps.ts";

// import * as Nano from "https://deno.land/x/nano_jsx@v0.0.11/mod.ts";
// import * as foo from "https://raw.githubusercontent.com/Abbondanzo/SubDom/testing/src/views/index.ejs";

const CURRENT_URL = dirname(import.meta.url);

export const renderIndex = async (baseUrl: string): Promise<string> => {
  //   const app = Nano.renderSSR(App());
  const pizzas = await fetch(
    "https://raw.githubusercontent.com/Abbondanzo/SubDom/testing/src/views/index.ejs",
  );
  const text = await pizzas.text();
  //   const template = await import(
  //     "https://raw.githubusercontent.com/Abbondanzo/SubDom/testing/src/views/index.ejs"
  //   );
  // const template = await import(`${CURRENT_URL}/index.ejs`);
  //   const filePath = `${CURRENT_URL}/index.ejs`;
  //   const reader = renderFile()
  //   compile(filePath);
  //   const filePath =
  // "https://raw.githubusercontent.com/Abbondanzo/SubDom/testing/src/views/index.ejs";
  //   return await renderToString(foo, { baseUrl });
  console.log(text);
  return "string";
};

export const render404 = async (baseUrl: string): Promise<string> => {
  const filePath = `${CURRENT_URL}/404.ejs`;
  return await renderFileToString(filePath, { baseUrl });
};
