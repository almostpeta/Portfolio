import https from "https";
import http from "http";
const fs = require("fs");
const express = require("express");
const app = express();
import { json, urlencoded } from "body-parser";
import ApiRouter from "./routes/index.js";
import generateTables from "./db/generateTables.js";
import crons from "./utils/crons.js";
import cors from "cors";
const swaggerSpecs = require("./routes-doc");
const swaggerUI = require("swagger-ui-express");
const deps = require("./deps");
const createLoggerMiddleware = require("./middleware/logger");

const corsOptions = {
  origin: ["*"],
  credentials: true,
  methods: "POST, PUT, OPTIONS, DELETE, GET",
  allowedHeaders:
    "Authorization, authorization, X-API-KEY, Origin, X-Auth-Token, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method",
};

const SSLOptions = {
  key: fs.readFileSync(process.env.KEY_URL),
  cert: fs.readFileSync(process.env.CERT_URL),
};

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("strict-origin-when-cross-origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, authorization, X-API-KEY, Origin, X-Auth-Token, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Content-Type", "application/json");
  next();
});

app.options("*", cors(corsOptions));

app.use(express.static(__dirname + "/public"));
app.use(json({ limit: "3mb" }));
app.use(urlencoded({ extended: false }));
app.use(createLoggerMiddleware(deps));

const apiRouter = new ApiRouter(deps);
app.use("/api", apiRouter.router);

generateTables();

crons();

const port = process.env.PORT || 4000;

export const start = async () => {
  const server =
    process.env.PROTOCOL === "http"
      ? http.createServer(app)
      : https.createServer(SSLOptions, app);
  server.listen(port, "0.0.0.0", () => console.log(`running on ${port}`));
};
