import { Server} from "socket.io";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
const ROOM = "group"
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", (socket) => {
  console.log("user connected successfully", socket.id);

  socket.on("joinRoom", async (userName) => {
    console.log(`username ${userName} joined room`);
    await socket.join(ROOM);
    socket.to(ROOM).emit("roomNotice",userName)
    socket.on("chatMessage",(msg)=>{
      socket.to(ROOM).emit("chatMessage",msg)
    })
  });
});

app.get("/", (req, res) => {
  res.send("hello");
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});