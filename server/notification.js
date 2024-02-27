// users.js
import express from 'express';
import * as dbOperations from './dbConnection.js';

const router = express.Router();
const notificationRouter = (io) => {
  // Create a new user
  router.post("/like", async (req, res) => {

    console.log(req.body.postId);
    // get post reaction
    const query = `SELECT t2.connectionId FROM Reaction t1
    join OnlineUsers t2 on t1.UserId = t2.UserId
    WHERE t1.PostId = ${req.body.postId}`; // Adjust the query based on your database schema
    
    const connectionIds = await dbOperations.executeQuery(query);
    
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item.connectionId).emit('likepost', "Mohit liked Mohit Post");
    })
    res.json(connectionIds);
  });

  router.post("/newpost", async (req, res) => {

    console.log(req.body.postId);
    // get post reaction
    const query = `SELECT connectionId FROM OnlineUsers`; // Adjust the query based on your database schema
    
    const connectionIds = await dbOperations.executeQuery(query);
    
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item.connectionId).emit('OnNewPost', "New post created");
    })
    res.json(connectionIds);
  });

  router.post("/notifyUser", async (req, res) => {

    console.log(req.body.NotificationId);
    // get post reaction
    const query = `SELECT UserNotification.*,OnlineUsers.ConnectionId 
    FROM UserNotification 
    LEFT JOIN OnlineUsers ON UserNotification.UserId = OnlineUsers.Id 
    Where UserNotification.NotificationId = ${req.body.NotificationId}`; // Adjust the query based on your database schema
    
    const connectionIds = await dbOperations.executeQuery(query);
    
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item.connectionId).emit('notifyUser', "Notification OBJ");
    })
    res.json(connectionIds);

  });

  return router;
}

export default notificationRouter;
