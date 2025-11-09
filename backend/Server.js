import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";

const ROOM = "group";
const app = express();
const server = createServer(app);

// ✅ CORS setup for both local dev and live Vercel site
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chat-app-react-fawn-alpha.vercel.app"
  ],
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-react-fawn-alpha.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("user connected successfully", socket.id);

  socket.on("joinRoom", async (userName) => {
    console.log(`username ${userName} joined room`);
    await socket.join(ROOM);
    socket.to(ROOM).emit("roomNotice", userName);

    socket.on("chatMessage", (msg) => {
      socket.to(ROOM).emit("chatMessage", msg);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

// ✅ use Render’s dynamic port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));