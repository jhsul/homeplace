import express from "express";
import session from "express-session";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config({ path: "../.env" });
console.log("Environment variables loaded");

import login from "./routes/login";
import signup from "./routes/signup";
import me from "./routes/me";
//console.log(process.env);

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const store = MongoStore.create({ mongoUrl: process.env.MONGO_URI! });

store.on("update", () => {
  console.log("Session updated");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware configuration
app.use(
  session({
    secret: process.env.SECRET!,
    name: "cia-nsa-metaverse-tracking-id",
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
app.post("/signup", signup);

app.get("/me", me);

// Websocket server
wss.on("connection", (ws: WebSocket, req: Request) => {
  console.log(`New websocket connection!`);
  //console.log(req.headers);

  ws.onclose = () => {
    console.log("Connection closed");
  };

  ws.send("Hi from the server :)");
});

server.listen(port, () => {
  console.log(`🎉 http://localhost:${port}`);
});
