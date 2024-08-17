import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

class AuthController {
    private db: mysql.Pool;

    constructor(db: mysql.Pool) {
        this.db = db;
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
      try {
          const { username, email, password } = req.body;
  
          if (!username || !email || !password) {
              res.status(400).json({ message: 'Username, email and password are required' });
              return;
          }
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          await this.db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',['username', 'email', hashedPassword]);
  
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
