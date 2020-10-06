import { setup } from "./src/index.ts";
import { Proxies } from "./src/redirectProxy.ts";

export interface SubDomConfig {
  baseUrl: string;
  port?: number; // Defaults to 4300
  useSSL?: boolean; // Defaults true
  writeToFile?: boolean; // Defaults false
  initialProxies?: Proxies;
}

export { setup };
