import { createRequire } from 'module';
import usersRouter from './userPost.js';
import notificationRouter from './notification.js';

const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const PORT = 4000;
const http = require("http").Server(app);
const cors = require("cors");
const io =  require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
import * as dbOperations from './dbConnection.js';
import authenticate from './middlewares/authenticate.middleware.js';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
app.use(authenticate);

// app.use("/users", usersRouter);
app.use("/users", usersRouter(io));

app.use("/notification",notificationRouter(io));

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

// Start the server
http.listen(PORT, async () => {
  await dbOperations.connectToDatabase();
  console.log(`Server listening on ${PORT}`);
});

// Gracefully disconnect from the database on process termination
process.on('SIGINT', async () => {
  await dbOperations.disconnectFromDatabase();
  process.exit();
});
