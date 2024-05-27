import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    // const token = authHeader && authHeader.split(' ')[1];
    const token = authHeader ;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        // console.log(user)
        //@ts-ignore
        req.user = user;
        next();
    });
};

export const authenticateSeller = (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
        //@ts-ignore
        if (req.user.role !== 'SELLER') {
            return res.sendStatus(403);
        }
        next();
    });
};