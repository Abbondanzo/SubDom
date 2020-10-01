import express from "express";
import path from "path";

import { RedirectProxy } from "./redirectProxy";

const SITE_NAME = "is.abbondanzo.com";

const router = (app: express.Express) => {
  const redirectProxy = new RedirectProxy({
    baseUrl: SITE_NAME,
    writeToFile: false,
    onError: console.error,
  });

  // Set some defaults
  redirectProxy.setRedirect("peter", "https://abbondanzo.com");
  redirectProxy.setRedirect("matt", "https://mattrb.com/");

  app.get("*", (req, res, next) => {
    const redirect = redirectProxy.getRedirect(req.headers.host);
    if (redirect) {
      console.log(`Found redirect: ${redirect}`);
      res.redirect(redirect);
    } else {
      return next();
    }
  });

  app.use("/", (req, res) => {
    res.render("index");
  });
};

const init = (port: number) => {
  const app = express();

  router(app);

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  console.log(`Listening on port ${port}`);
  app.listen(port);
};

init(4567);
