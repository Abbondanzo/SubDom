interface RedirectProxyOptions {
  baseUrl: string;
  writeToFile?: boolean;
  initialProxies?: Proxies;
  onError?: ErrorCallback;
}

type Url = string;
export type Proxies = {
  [subdomain: string]: Url;
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

  public getRedirect(host: string): string | null {
    const subdomain = this.parseSubdomain(host);
    if (!subdomain) {
      return null;
    }
    return this.proxies[subdomain] || null;
  }

  public setRedirect(subdomain: string, redirect: string) {
    redirect = this.domainWithProtocol(redirect);
    this.proxies[subdomain.toLowerCase()] = redirect;
    this.updateFile();
  }

  public matchesBaseUrl(url: string): boolean {
    return url === this.baseUrl;
  }

  public getBaseUrl(): string {
    return `https://${this.baseUrl}`;
  }

  private parseSubdomain(host: string): string | null {
    const split = host.toLowerCase().split(this.baseUrl);
    if (split.length !== 2 || split[1] !== "") {
      return null;
    }
    const subdomain = split[0];
    if (subdomain.endsWith(".")) {
      return subdomain.slice(0, -1);
    }
    return subdomain;
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
