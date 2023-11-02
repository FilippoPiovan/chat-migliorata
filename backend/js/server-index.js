import http from "http";
import join from "path";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { funzioniDB } from "./../functions/funzioniDB.js";
const port = 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);

funzioniDB.sincronizzaDB();

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../html/server-index.html"));
});

io.on("connection", (socket) => {
  socket.on("sonoUtente", async (idUtente) => {
    const utente = await funzioniDB.collegaUtente({ idUtente });
    socket.emit("inizializza", idUtente);
    // io.emit("utenteCollegato", utente);
  });

  socket.on("disconnect", () => {
    console.log("Arrivederci ", socket.id);
  });
});

server.listen(port, () => {
  console.log("Indirizzo: http://localhost:3000");
});
