import { setup } from "./src/index.ts";
import { Proxies } from "./src/redirectProxy.ts";

export interface SubDomConfig {
  baseUrl: string;
  port?: number; // Defaults to 4300
  writeToFile?: boolean;
  initialProxies?: Proxies;
}

export { setup };
