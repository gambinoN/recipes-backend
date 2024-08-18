import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { registerPayload } from '../model/payload/registerPayload';

class AuthController {
    private db: mysql.Pool;

    constructor(db: mysql.Pool) {
        this.db = db;
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
      try {
          const { username, email, password } = req.body;

          const payload = new registerPayload(username, email, password)

          if(!payload.isValid()) {
                res.status(400).json({ message: 'Username, email and password are required' });
                return;
          }
  
          if (!payload.isEmailValid()) {
            res.status(400).json({ message: 'Email is not formatted properly' });
          }

          const [existingUser] = await this.db.query('SELECT * FROM users WHERE username = ? OR email = ?', [
            payload.username,
            payload.email,
        ]);

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            res.status(409).json({ message: 'Username or email already exists' });
            return;
        }
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          await this.db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
                payload.username,
                payload.email,
                hashedPassword,
            ]);  

          res.status(201).json({ message: 'User registered successfully!' });
          return;
      } catch (error) {
          console.error('Error registering user:', error);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
      }
  }
  

    // Additional methods like loginUser, logoutUser, etc., can be added here.
}

export default AuthController;
