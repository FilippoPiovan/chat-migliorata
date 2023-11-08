import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { logger } from "./utils/log.js";
import { utilsDB } from "./utils/utilsDB.js";
import { socketEventsHandler } from "./utils/utilsSocket.js";

await utilsDB.synchronizeDB();
await utilsDB.setAllUsersDisconnected();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);

socketEventsHandler(io, utilsDB);

server.listen(3000, () => {
  logger.info(`Indirizzo: http://localhost:3000`);
});
