// server.js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let AllformData = []; // Stores all form entries

io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  // Receive new or edited form data
  socket.on("formData", (formData) => {
    
    console.log(`📝 Received data from ${socket.id}:`, formData);

    // Attach socket ID if not already present (used for update/delete)
    const id = formData.id || socket.id;

    const index = AllformData.findIndex(entry => entry.id === id);
    if (index !== -1) {
      // Edit existing entry
      AllformData[index] = { ...formData, id };
    } else {
      // New entry
      AllformData.push({ ...formData, id });
    }

    console.log("📦 Updated AllformData:", AllformData);
    io.emit("allformData", AllformData); // Notify all clients
  });

  // Handle deletion
  socket.on("deleteEntry", (id) => {
    console.log(`❌ Deleting entry with ID: ${id}`);
    AllformData = AllformData.filter(entry => entry.id !== id);
    io.emit("allformData", AllformData);
  });

  // On disconnect, remove entry
  socket.on("disconnect", () => {
    console.log(`🚪 Disconnected: ${socket.id}`);
    AllformData = AllformData.filter(entry => entry.id !== socket.id);
    io.emit("allformData", AllformData);
  });
});

// Optional: periodically send updates
setInterval(() => {
  io.emit("allformData", AllformData);
}, 5000);

httpServer.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
