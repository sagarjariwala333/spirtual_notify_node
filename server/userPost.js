// users.js
import express from 'express';
import * as dbOperations from './dbConnection.js';
const router = express.Router();
const usersRouter = (io) => {
    // Get all users
    router.get("/", async (req, res) => {
      try {
        const query = 'SELECT * FROM Users'; // Adjust the query based on your database schema
        const users = await dbOperations.executeQuery(query);
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
// Get user detail

  router.get("/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const query = `SELECT * FROM users WHERE Id = ${userId}`; // Adjust the query based on your database schema
      const user = await dbOperations.executeQuery(query);
      
      if (!user || user.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};  
// Get all users
export default usersRouter;
