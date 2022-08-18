import express from "express";
import session from "express-session";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config({ path: "../.env" });

import auth from "./middleware/auth";

import login from "./routes/login";
import signup from "./routes/signup";
import me from "./routes/me";
import logout from "./routes/logout";
import place from "./routes/place";
import board from "./routes/board";

import type { WebSocketMessage } from "./messages";
import { getDb } from "./db";
import { getRedis } from "./redis";

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI!,
  dbName: "home",
});
export const broadcast = (message: WebSocketMessage) => {
  console.log("Broadcasting", message, `to ${wss.clients.size} clients`);
  for (const client of wss.clients) {
    client.send(JSON.stringify(message));
  }
};

// Establish connections to redis and mongo

//getDb();

store.on("update", () => {
  console.log("Session updated");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware configuration
app.use(
  session({
    secret: process.env.SECRET!,
    name: process.env.COOKIE_NAME!,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true },
    cookie: { secure: false }, // TODO: remove this line when in production
    store,
  })
);

// Statically serve the vite frontend
app.use(express.static("../client/dist"));

// API routes
app.post("/login", login);
app.get("/board", board);

app.post("/signup", signup);
app.post("/place", auth, place);
app.get("/me", auth, me);
app.delete("/me", auth, logout);

// Websocket server
wss.on("connection", (ws: WebSocket, req: Request) => {
  //console.log(`New websocket connection!`);
  //console.log(req.headers);
  broadcast({ type: "userCount", data: wss.clients.size });

  ws.onclose = () => {
    broadcast({ type: "userCount", data: wss.clients.size });
  };

  //ws.send("Hi from the server :)");
});

server.listen(port, () => {
  console.log(`🎉 http://localhost:${port}`);
});

getRedis();
