import express from "express";
import { generatePrime, isPrime } from "./prime.js";
import * as dotenv from "dotenv";
import env from "env-var";
dotenv.config({ path: ".env" });

const app = express();

app.post("/api/numbers/prime/validate", (req, res) => {
  try {
    const body = req.body;
    const prime = true;
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const value = body[key];
        if (!isPrime(value)) {
          prime = false;
        }
      }
    }
    if (prime) {
      res.status(200).send("true");
    } else {
      res.status(200).send("false");
    }
  } catch (err) {
    res.status(400).send("Invalid JSON data");
  }
});

app.get("/api/numbers/prime", (req, res) => {
  const { amount } = req.query;
  if (isNaN(amount)) {
    res.status(400).send("Invalid 'amount' query parameter");
  } else {
    const nPrimeNumbers = generatePrime(amount);
    res.status(200).send(nPrimeNumbers);
  }
});

app.set("view engine", "pug");

app.get("/api/numbers/prime/display", (req, res) => {
  res.render("index", { primeNumbers: generatePrime(10) });
});

const port = env.get("PORT").default("5432").asPortNumber();

app.listen(port, () => {
  console.log("app is listening in port", port);
});
