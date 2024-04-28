import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
import * as dbOperations from '../dbConnection.js';

const getUserById = async (id) => {
    try {
        const userId = id;
        const query = `SELECT * FROM users WHERE Id = ${userId}`; // Adjust the query based on your database schema
        const user = await dbOperations.executeQuery(query);
        return user;  
      } catch (error) {
        throw new Error(error);
      }
}

const authenticate = async (req, res, next) => {
    try {
        const token = req?.headers['authorization']
        
        if(!token) {
            return res.status(401).json({ messsage: 'Token not found'});
        }
        const jwtToken = token.split(' ')[1].trim();
        const decoded = jwt.decode(jwtToken);
        const user = await getUserById(decoded.Id);
        
        if(!user || user.IsDeleted) {
            return res.status(401).json({message: 'User not found'})
        }
        
        if(!decoded.Username || !user.UserName || (decoded.Username !== user.UserName)) {
            return res.status(401).json({message: 'Invalid user'})
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (!(decoded && decoded.exp && decoded.exp > currentTimestamp)) {
            return res.status(401).json({message: 'Token expired'})
        }
        // console.log(jwtToken)
        // jwt.verify(jwtToken,'drivematesecretkeyJWTServiceAccessToken123', 
        //     {
        //         algorithms: ['SHA256', 'HS256', 'HS384', 'HS512', 'none']
        //     })
    }
    catch(err) {
        console.error(err)
        next();
    }
}

export default authenticate;