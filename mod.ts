import { setup } from "./src/index.ts";
import { Proxies } from "./src/redirectProxy.ts";

export interface SubDomConfig {
  baseUrl: string;
  port?: number; // Defaults to 4300
  writeToFile?: boolean;
  initialProxies?: Proxies;
}

const TEST_ARG = "--test";
if (Deno.args.includes(TEST_ARG)) {
  setup(
    {
      baseUrl: "is.abbondanzo.com",
      writeToFile: false,
      port: 4567,
      initialProxies: {
        "peter": "https://abbondanzo.com",
        "matt": "https://mattrb.com",
      },
    },
  );
}

export { setup };
