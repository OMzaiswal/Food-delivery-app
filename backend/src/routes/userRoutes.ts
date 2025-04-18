import { Router } from "express";
import { authenticate, AuthorizeUser } from "../middlewares/authMiddleware";
import prisma from "../lib/prismaClient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const SECRET_KEY = process.env.JWT_SECRET;

if(!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not set in the environment variables!');
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({message: 'All fields are required'});
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { 
                cart: {
                    include: {
                        items: true
                    }
                }
            }
        })
        if(!user) {
            res.status(404).json({message: "User does not exist"});
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({message: "Invalid password, Try again!"});
            return;
        }

        const token = jwt.sign({ id: user.id, role: 'user'}, SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const cart: Record<string, number>  = {};
        user.cart?.items.forEach(item => {
            cart[item.foodItemId] = item.quantity;
        })

        res.status(200).json({message: "Logged in successfully", fullName: user.fullName, cart });
        return;
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
})

router.get('/dashboard', authenticate, AuthorizeUser, (req, res) => {

})


router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        res.status(400).json({message: 'All fields are required!'});
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser) {
            res.status(409).json({message: 'User already exists'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { fullName, email, password: hashedPassword }
        })

        const token = jwt.sign({id: newUser.id, role: 'user'}, SECRET_KEY, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({message: 'User registered successfully!', token});
        return;
    } catch(err) {
        console.log(err);
        res.status(500).json("Internal Server error");
        return;
    }
})

router.use(authenticate, AuthorizeUser);

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        res.status(200).json({ message: "User logged out successfully"});
        return;
    } catch (err) {
        console.log('Error clearing cookie', err);
        res.status(500).json({message: "Unable to logout"});

    }
})

router.get('/auth/me', async (req, res) => {
    try {
        const id = req.user?.id;
        const user = await prisma.user.findUnique({ 
            where: { id },
            include: {
                cart: {
                    include: {
                        items: true
                    }
                }
            }
        });
        const cart: Record<string, number> = {}
        user?.cart?.items.forEach(item => {
            cart[item.foodItemId] = item.quantity;
        })
        res.status(200).json({ message: 'User is logged in', fullName: user?.fullName, cart });
        return;
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
        return;
    }
})


export default router;