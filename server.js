import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import methodOverride from "method-override";
import { appendUserData } from "./middleware/appenduserdata.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getAccessToken } from "./middleware/getaccesstoken.js";
import { getUserInfo } from "./middleware/getuserinfo.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view-engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  "/assets",
  checkAuthenticated,
  express.static(join(__dirname, "assets"))
);
app.use(methodOverride("_method"));

// Page to download the requested resource
app.get("/", checkAuthenticated, (req, res) => {
  const resourceUrl = req.query.resourceUrl;
  const referer = req.query.referer || req.header("Referer");
  res.render("downloads.ejs", { resourceUrl, referer });
});

// To redirect user to linkedin login page
app.get("/auth/linkedin", checkNotAuthenticated, (req, res) => {
  const resourceUrl = req.query.resourceUrl;
  const referer = req.query.referer;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    `${process.env.LINKEDIN_CALLBACK}?resourceUrl=${resourceUrl}&referer=${referer}`
  );
  const state = Math.random().toString(36).substring(7);

  const scope = encodeURIComponent("openid profile email");

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  res.redirect(authUrl);
});

// To redirect user back to our page and storing their data
app.get("/auth/linkedin/callback", checkNotAuthenticated, async (req, res) => {
  try {
    const resourceUrl = req.query.resourceUrl;
    const referer = req.query.referer;
    const code = req.query.code;
    const redirectUri = encodeURIComponent(
      `${process.env.LINKEDIN_CALLBACK}?resourceUrl=${resourceUrl}&referer=${referer}`
    );
    const accessToken = await getAccessToken(code, redirectUri);
    const userInfo = await getUserInfo(accessToken);

    appendUserData(userInfo);

    req.session.user = userInfo;
    res.redirect(
      `/?action=download&resourceUrl=${resourceUrl}&referer=${referer}`
    );
  } catch (error) {
    res.status(500).json({
      message: `Internal Server Error, ${error}`,
    });
  }
});

function checkAuthenticated(req, res, next) {
  const resourceUrl = req.query.resourceUrl;
  const referer = req.header("Referer");
  if (req.session.user) {
    return next();
  }
  res.redirect(`/auth/linkedin?resourceUrl=${resourceUrl}&referer=${referer}`);
}

function checkNotAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
