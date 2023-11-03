import * as http from "http";
import { env } from "process";
import url from "url";
import fspromises from "fs/promises";
import { isPrime } from "./prime.js";
import { generatePrime } from "./prime.js";

async function readConfigFile() {
  const data = await fspromises.readFile("./config.json", "utf8");
  const config = JSON.parse(data);
  return config.PORT;
}

function handleGetNPrimeNumbers(req, res) {
  const parsedURL = url.parse(req.url, true);
  const amount = parseInt(parsedURL.query.amount, 10);

  if (isNaN(amount)) {
    sendError(res, 400, "Invalid 'amount' query parameter");
  } else {
    const nPrimeNumbers = generatePrime(amount);
    sendResponse(res, 200, nPrimeNumbers);
  }
}

function handlePostReqIsPrimeNumbers(req, res) {
  let body = "";

  req.on("data", (data) => {
    body += data.toString();
  });

  req.on("end", () => {
    try {
      const requestBody = JSON.parse(body);
      const prime = Object.values(requestBody).every((value) => isPrime(value));

      sendResponse(res, 200, prime);
    } catch (error) {
      sendError(res, 400, "Invalid JSON data");
    }
  });
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendResponse(res, statusCode, { error: message });
}

const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const path = url.parse(reqUrl, true).pathname;

  if (method === "GET" && path === "/api/numbers/prime") {
    handleGetNPrimeNumbers(req, res);
  } else if (method === "POST" && path === "/api/numbers/prime/validate") {
    handlePostReqIsPrimeNumbers(req, res);
  } else {
    sendError(res, 404, "Not Found");
  }
});

const PORT = env.SERVER_PORT || (await readConfigFile());

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
