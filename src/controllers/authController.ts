import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { registerPayload } from '../model/payload/registerPayload';
import { loginPayload } from '../model/payload/loginPayload';
import { User } from '../model/database/User';
import jwt from 'jsonwebtoken';

class AuthController {
    private db: mysql.Pool;

    constructor(db: mysql.Pool) {
        this.db = db;
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;

            const payload = new registerPayload(username, email, password);
            
            if (!payload.isValid()) {
                res.status(400).json({ message: 'Username, email, and password are required' });
                return;
            }

            if (!payload.isEmailValid()) {
                res.status(400).json({ message: 'Email is not formatted properly' });
                return;
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

            const [result] = await this.db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
                payload.username,
                payload.email,
                hashedPassword,
            ]);

            const userId = (result as any).insertId;

            const newUser = new User(userId, payload.username, payload.email, hashedPassword);

            res.status(201).json({ message: 'User registered successfully!', user: newUser.serialize() });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
    
        try {
            const [rows] = await this.db.query('SELECT * FROM users WHERE email = ?', [email]) as [User[], mysql.FieldPacket[]];
    
            if (Array.isArray(rows) && rows.length === 0) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
    
            const userRow = rows[0];
            const user = new User(userRow.id, userRow.username, userRow.email, userRow.password);
    
            const isMatch = await user.comparePassword(password);
    
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
    
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
    
            res.json({ token });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default AuthController;
