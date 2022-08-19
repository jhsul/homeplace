import express from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config({ path: "../.env" });

import auth from "./middleware/auth";
import stores from "./middleware/stores";

import login from "./routes/login";
import signup from "./routes/signup";
import me from "./routes/me";
import logout from "./routes/logout";
import place from "./routes/place";
import board from "./routes/board";

import type { WebSocketMessage } from "./messages";
import { getRedis, buildFromMongo } from "./redis";

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

app.set("trust proxy", 1);

//app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stores
app.use(stores);

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

// Assign middleware to /place afer redis is ready
//app.post("/place", limiter, auth, place); // limit /place
app.get("/me", auth, me);
app.delete("/me", auth, logout);

// Websocket server
wss.on("connection", (ws: WebSocket, req: Request) => {
  broadcast({ type: "userCount", data: wss.clients.size });

  ws.onclose = () => {
    broadcast({ type: "userCount", data: wss.clients.size });
  };
});

getRedis()
  .then(buildFromMongo)
  .then((client) => {
    const limiter = rateLimit({
      windowMs: 2000,
      //@ts-ignore
      max: process.env.RATE_LIMIT!,
      message: JSON.stringify({ error: "Too fast" }),
      standardHeaders: true,
      legacyHeaders: false,
      store: new RedisStore({
        sendCommand: (...args: string[]) => {
          return client.sendCommand(args);
        },
      }),
    });

    app.use("/place", limiter, auth, place);
    server.listen(port, () => {
      console.log(`🎉 http://localhost:${port}`);
    });
  });
