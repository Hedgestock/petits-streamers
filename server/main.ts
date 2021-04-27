import express from "express";
import fetch from "node-fetch";
import { readFileSync } from "fs";
import * as path from "path";
import { parseURL, post } from "./helpers";

const app = express();
const port = 8000;

const credentials = JSON.parse(
  readFileSync("./server/credentials.json", "utf-8")
);
const streamers = JSON.parse(readFileSync("./server/streams.json", "utf-8"));

console.log(__dirname);
let appBearer: string;
post("https://id.twitch.tv/oauth2/token", {
  ...credentials,
  grant_type: "client_credentials",
})
  .then((response) => response.json())
  .then((data) => (appBearer = data.access_token));

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/streams", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/index.html"));
});

app.get("/api/streams", async (req, res) => {
  const data = await getStreams(streamers);
  // console.log("data", data);
  console.log("length", data.data.length);
  res.send(JSON.stringify(data));
});

app.use(function (req, res, next) {
  console.log(req.url, "404");
  res.status(404).send("Unable to find the requested resource!");
});

app.listen(8000, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// "esModuleInterop": true,
//   for await (const req of server) {
//     console.log(req.method, req.url);
//     let file;
//     const URLObject = parseURL(req.url);
//     switch (URLObject.path) {
//       case "":
//       case "/":
//       case "/streams":
//         file = await serveFile(req, "./static/index.html");
//         req.respond(file);
//         break;
//       case "/favicon.ico":
//         file = await serveFile(req, "./static/favico.png");
//         req.respond(file);
//         break;
//       case "/logo":
//         file = await serveFile(req, "./static/logo.png");
//         req.respond(file);
//         break;
//       case "/api/streams":
//         const data = await getStreams(streamers);
//         // console.log("data", data);
//         console.log("length", data.data.length);
//         req.respond({ body: JSON.stringify(data) });
//         break;
//       case "/test":
//         getStreams(streamers);
//         req.respond({ body: "test" });
//         break;
//       default:
//         console.error("404");
//         req.respond({ status: 404, body: "404! Page Not Found!" });
//     }
//   }
// };

function getStreams(streamers: string[]) {
  let url = "https://api.twitch.tv/helix/streams?";

  streamers.forEach((login) => (url += `user_login=${login}&`));

  console.log("url", url);

  return fetch(url, {
    headers: {
      "Client-Id": credentials.client_id,
      Authorization: `Bearer ${appBearer}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      return data;
    });
}
