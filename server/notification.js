// users.js
import express from 'express';
import * as dbOperations from './dbConnection.js';

const router = express.Router();
const notificationRouter = (io) => {
  // Create a new user

  router.post("/like", async (req, res) => {
    // get post reaction
    const query = `SELECT t2.connectionId FROM Reaction t1
    join OnlineUsers t2 on t1.UserId = t2.UserId  
    WHERE t1.PostId = ${req.body.postId}`; // Adjust the query based on your database schema
    
    const connectionIds = await dbOperations.executeQuery(query);
    
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item.connectionId).emit('likepost', req.body );
    })
    return res.status(200).json(connectionIds);
  });

  router.post("/newmessage", async (req, res) => {
    console.log("checked");

    console.log(req.body);
    const connectionIds = req.body.connectionIds;
    
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item).emit('SendChatMessage', req.body );
    })
    res.json(connectionIds);
  });

  router.post("/notify", async (req, res) => {
    console.log(req.body.postId);
    console.log(req.body);
    // get post reaction
      const query = `SELECT n.ActionType,n.Message,ou.connectionId,aud.Id As ActionUserId, CONCAT(aud.firstName, ' ', aud.lastName) AS ActionFullName,
      ud.Id As UserId, CONCAT(ud.firstName, ' ', ud.lastName) AS FullName
      FROM notification AS n
      JOIN userNotification AS un ON n.Id = un.NotificationId
      JOIN onlineUsers AS ou ON un.userId = ou.userId
      JOIN users AS aud ON n.actionbyuserId = aud.id
      JOIN users AS ud ON ou.userId = ud.id
      WHERE aud.id != ud.id and n.id =  ${req.body.Id} ;`
    
    const connectionIds = await dbOperations.executeQuery(query);
    
    console.log("data",connectionIds);
    if (!connectionIds || connectionIds.length === 0) {
      return res.status(404).json({ error: 'Connections not found' });
    }

    connectionIds.map((item)=>{
      io.to(item.connectionId).emit('NewNotification', item );
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
      io.to(item.connectionId).emit('OnNewPost', req.body);
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
