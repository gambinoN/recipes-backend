import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../model/response/ApiResponse";

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json(new ApiResponse(null, 'Missing required fields!'));
    } else {
        next();
    }
}