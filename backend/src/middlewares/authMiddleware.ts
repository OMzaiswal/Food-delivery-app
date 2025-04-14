
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
dotenv.config()


export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies.token

        if(!token) {
            res.status(401).json('Authentication token not found, Please log in');
            return;
        }

        const SECRET_KEY = process.env.JWT_SECRET
        if(!SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not set in environment variable');
        }

        const decoded = jwt.verify(token, SECRET_KEY) as {id: string, role: string};
        req.user = decoded;
        next()

        } catch(err) {
            res.status(403).json({error: 'Invalid or expired cookie, please login again'});
            return;
        }   
}

export const AuthorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({message: 'Forbidden: Admins only allowed'});
        return;
    }
    next();
};

export const AuthorizeUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'user') {
        res.status(403).json({message: 'Forbidden: Users Only'});
        return;
    }
    next();
}