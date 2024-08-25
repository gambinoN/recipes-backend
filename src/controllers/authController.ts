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
            const isVerified = false;
            const verificationToken = v4();

            const { username, email, password } = req.body;

            const existingUser = await this.userRepository.findOne({ where: [{ username }, { email }] });

            if (existingUser) {
                res.status(409).json(new ApiResponse(null, "User already exists, please login to your account!"));
                return;
            }

            const user = this.userRepository.create({ username, email, password, verificationToken, isVerified });
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
            console.log(user)

            if(!user?.isVerified) {
                res.status(401).json(new ApiResponse(null, 'This user is not verified'));
                return;
            }
    
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
    
    public async verifyUser(req: Request, res: Response): Promise<void> {
        try {
            const { verificationToken } = req.params;
    
            const user = await this.userRepository.findOne({ where: { verificationToken } });
    
            if (!user) {
                res.status(404).json(new ApiResponse(null, 'User not found'));
                return;
            }

            if (user.isVerified) {
                res.status(409).json(new ApiResponse(null, 'User is already verified'));
                return;
            }
    
            user.isVerified = true;
    
            await this.userRepository.save(user);
    
            res.status(200).json(new ApiResponse(null, 'User verified successfully'));
        } catch (error) {
            res.status(500).json(new ApiResponse(null, 'Internal Server Error'));
        }
    }
}

export default AuthController;
