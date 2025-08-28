import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import os from "os";

import cors from "cors";

const app = express();
const server = http.createServer(app);


app.use(cors());

app.use((req, _res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

app.options("/ip", (req, res) => {
  console.log(`🟡 Preflight request to ${req.url}`);
  res.sendStatus(200); // send OK so browser is happy
});

const io = new Server(server, {
  cors: {
    origin: "*", // 👈 allow all origins for testing
    methods: ["GET", "POST"]
  }
});

interface JudgeScore {
  judge: "j1" | "j2" | "j3";
  side: "red" | "blue";
}

// 🔹 Function to get local network IP
function getLocalIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost"; // fallback
}

const localIp = getLocalIp();

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Socket.IO + TypeScript server is running");
});

// Endpoint to expose LAN IP
app.get("/ip", (_req: Request, res: Response) => {
  res.json({ ip: localIp });
});

// Handle socket connections
io.on("connection", (socket: Socket) => {
  console.log("⚡ A client connected:", socket.id);

  // When a judge sends a score
  socket.on("judge-score", (data: JudgeScore) => {
    console.log("📩 Score received:", data);
    io.emit("judge-score", data); // broadcast to all clients
  });

  // Reset event
  socket.on("reset-scores", () => {
    console.log("🧹 Reset command received");
    io.emit("reset-scores");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at:`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  console.log(`   ➜ Network: http://${localIp}:${PORT}`);
});
