import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../model/database/User';
import { AppDataSource } from '../../config/database';
import jwt from 'jsonwebtoken';

class AuthController {
    private userRepository: Repository<User>;

    constructor() {
      this.userRepository = AppDataSource.getRepository(User);
    }

  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });

      if (existingUser) {
        res.status(409).json({ message: 'Username or email already exists' });
        return;
      }

      const user = this.userRepository.create({
        username,
        email,
        password
      });

      await this.userRepository.save(user);

      res.status(201).json({ message: 'User registered successfully!', user: user.serialize() });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { email } });

      if (!user || !(await user.comparePassword(password))) {
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
