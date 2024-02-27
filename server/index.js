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


// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
app.get("/users", (req, res) => {
  // Execute database query and return results
  const usersQuery = 'SELECT * FROM YourUsersTable';
  dbOperations.executeQuery(usersQuery)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get("/comments", (req, res) => {
  // Emit event to a specific socket
  io.to("q7DJFY0eeQ0BQieMAAAH").emit('new-comment', { comment: 'some comment' });

  // Retrieve and return comments from the database
  const commentsQuery = 'SELECT * FROM YourCommentsTable';
  dbOperations.executeQuery(commentsQuery)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post("/comments", async (req, res) => {
  // Create a new comment in the database
  const comment = req.body;
  const insertQuery = `INSERT INTO YourCommentsTable (Column1, Column2) VALUES ('${comment.value1}', '${comment.value2}')`;
  
  try {
    await dbOperations.executeQuery(insertQuery);
    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
