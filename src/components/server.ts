import { React, ReactDOMServer } from "../../deps.ts";

const { default: App } = await import("./App.tsx");

export const renderApp = () => (ReactDOMServer as any).renderToString(App());
