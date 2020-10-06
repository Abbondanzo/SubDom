interface RedirectProxyOptions {
  baseUrl: string;
  writeToFile?: boolean;
  initialProxies?: Proxies;
  onError?: ErrorCallback;
}

type Url = string;
export type Proxies = {
  [alias: string]: Url;
};
type ErrorCallback = (error: any) => void;

export class RedirectProxy {
  private readonly baseUrl: string;
  private readonly fileName: string | null;
  private readonly proxies: Proxies;
  private readonly onError: ErrorCallback;

  constructor(
    { baseUrl, writeToFile, initialProxies, onError }: RedirectProxyOptions,
  ) {
    this.baseUrl = baseUrl.toLowerCase().replace(/^https?:\/\//, "");
    this.fileName = writeToFile ? `${this.baseUrl}.config.json` : null;
    this.proxies = initialProxies || {};
    this.onError = onError || noop;
  }

  /**
   * Given a full hostname with base URL, parse and return a redirect URL if one exists.
   * 
   * @param host full host including base URL
   */
  public getRedirect(host: string): string | null {
    const subdomain = this.parseHostForAlias(host);
    if (!subdomain) {
      return null;
    }
    return this.proxies[subdomain] || null;
  }

  public setRedirect(alias: string, redirect: string) {
    redirect = this.domainWithProtocol(redirect);
    this.proxies[alias.toLowerCase()] = redirect;
    this.updateFile();
  }

  public matchesBaseUrl(url: string): boolean {
    return url === this.baseUrl;
  }

  public getBaseUrl(): string {
    return `https://${this.baseUrl}`;
  }

  public hasAlias(alias: string): boolean {
    return Boolean(this.proxies[alias]);
  }

  private parseHostForAlias(host: string): string | null {
    const split = host.toLowerCase().split(this.baseUrl);
    if (split.length !== 2 || split[1] !== "") {
      return null;
    }
    const alias = split[0];
    if (alias.endsWith(".")) {
      return alias.slice(0, -1);
    }
    return alias;
  }

  private domainWithProtocol(domain: string): string {
    if (!domain.match(/^https?:\/\//)) {
      return `https://${domain}`;
    } else {
      return domain;
    }
  }

  private updateFile() {
    if (this.fileName === null) {
      return;
    }
    this.onError("WRITING NOT IMPLEMENTED");
    // TODO: Write to config
  }
}

const noop = (_: any) => {};
