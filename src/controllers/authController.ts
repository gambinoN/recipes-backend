import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../model/database/User';
import { AppDataSource } from '../../config/database';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import sendVerificationEmail from '../util/emailUtils';
import { ApiResponse } from '../model/response/ApiResponse';

class AuthController {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const verificationToken = v4();

            const { username, email, password } = req.body;

            const existingUser = await this.userRepository.findOne({ where: [{ username }, { email }] });

            if (existingUser) {
                res.status(409).json(new ApiResponse(null, "User already exists, please login to your account!"));
                return;
            }

            const user = this.userRepository.create({ username, email, password });
            await this.userRepository.save(user);

            const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

            sendVerificationEmail(email, verificationLink);

            res.status(201).json(new ApiResponse(user.serialize(), null));
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json(new ApiResponse(null, 'Internal Server Error'));
        }
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
    
            const user = await this.userRepository.findOne({ where: { email } });
    
            if (!user || !(await user.comparePassword(password))) {
                res.status(401).json(new ApiResponse(null, 'Invalid email or password'));
                return;
            }
    
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
    
            res.json({ token });
        } catch (error) {
            res.status(500).json(new ApiResponse(null, 'Internal Server Error'));
        }
    }
    
}

export default AuthController;
