import { Request, Response, NextFunction } from "express";

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        res.status(400).json({message: 'Missing required fields'});
    }
    next();
}