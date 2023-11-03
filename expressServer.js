import express from "express";
import { generatePrime } from "./prime.js";
import * as dotenv from "dotenv";
import env from "env-var";
dotenv.config({ path: ".env" });

const app = express();

app.set("view engine", "pug");

app.get("/API/numbers/prime/display", (req, res) => {
  res.render("index", { primeNumbers: generatePrime(10) });
});

const port = env.get("PORT").default("5432").asPortNumber();

app.listen(port, () => {
  console.log("app is listening in port", port);
});
