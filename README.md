# SubDom

Like many great side-projects, this spawned out of a stupid idea with an even stupider name. SubDom is short for sub-domain (I know what you're thinking, but I like my employer and so we're going to keep this PG). It's a simple tool written for Deno users because I haven't made anything with Deno before, and I needed a good excuse to distract myself with something I'm not emotionally attached to.

The concept is simple. You have a worthless domain and you want it to redirect to other services, but not a simple 302 call-it-a-day-you-can-post-this-for-Twitter-likes redirect. You've recently discovered electricity and learned that subdomains are a thing. So, you wildcard it.

Say you somehow own the `stupid.com` domain. You want to make fun of your friends, so you designate `i.am.stupid.com` as a temporary redirect to `yourfriendswebsite.com`. Or maybe `im.with.stupid.com` redirects to your domain. How about `this.is.stupid.com` redirects right here? The possibilities are as endless as the capacity of your system's memory.

## Sounds great, where do I begin?

I haven't written this yet. I haven't written code yet. This part comes _after_ I write the config for you to lazily set up.

When you're ready to write a config, you can call the `setup` function exposed by this project.

```typescript
// ./my-project/src/mod.ts
import { setup } from "this.github.repo.com/mod.ts";

setup({
  baseUrl: "stupid.com",
  writeToFile: false,
  port: 1234,
  initialProxies: {
    "i.am": "https://yourfriendswebsite.com",
    "im.with": "https://yourwebsite.com",
  },
});
```

Then, you can run the project with the following command

```bash
$ deno run --allow-read --allow-net ./my-project/mod.ts
```
