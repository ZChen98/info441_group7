import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from "express-session";
import msIdExpress from "microsoft-identity-express";

const appSettings = {
  appCredentials: {
    clientId: "51052a42-da27-4fa8-84a6-06a59df266dc",
    tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "4SQ7Q~eUHrU1Aq70t4Ezv7yEHYNGb.LOxKI26",
  },

  authRoutes: {
    redirect: "https://project.jcyyds.me/redirect",
    // redirect: "http://localhost:3000/redirect", // for local test
    error: "/error", // the wrapper will redirect to this route in case of any error.
    unauthorized: "/unauthorized", // the wrapper will redirect to this route in case of unauthorized access attempt.
  },
};
import db from "./db.js";
import indexRouter from './routes/index.js';
import apiv1Router from "./routes/api/v1/apiv1.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  req.db = db;
  next();
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret:
      "this is some secret key I am making up  vewkhivw44einvwvripouew t5e98n4w",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use('/', indexRouter);
app.use("/api/v1", apiv1Router);

app.get("/signin", msid.signIn({ postLoginRedirect: "/" }));

app.get("/signout", msid.signOut({ postLogoutRedirect: "/" }));

app.get("/error", (req, res) => res.status(500).send("Server Error"));

app.get("/unauthorized", (req, res) =>
  res.status(401).send("Permission Denied")
);

export default app;
