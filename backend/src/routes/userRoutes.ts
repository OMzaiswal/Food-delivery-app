import { Router } from "express";
import { authenticate, AuthorizeUser } from "../middlewares/authMiddleware";
import prisma from "../lib/prismaClient";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

const router = Router();

const SECRET_KEY = process.env.JWT_SECRET;
const baseUrl = process.env.CLIENT_URL;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia'})

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
        return;
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
        return;
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
        res.status(200).json({ message: 'User is logged in', fullName: user?.fullName, email: user?.email, cart });
        return;
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
        return;
    }
})

router.post('/create-checkout-session', async (req, res) => {
    const { amount, phoneNumber, address } = req.body;
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized"});
            return;
        }
        const user = await prisma.user.findUnique({ where: { id: userId }});

        if (!user) {
            res.status(404).json({ message: "User not found"});
            return;
        }

        if (!user.phoneNumber && phoneNumber) {
            await prisma.user.update({
                where: { id: userId },
                data: { phoneNumber }
            })
        }

        await prisma.address.create({
            data: {
                ...address,
                userId
            }
        })

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { 
                items: {
                    include: { foodItem: true}
            } }
        })
            
        if (!cart || cart.items.length === 0) {
            res.status(404).json({ message: 'Cart is empty'});
            return;
        }
            
        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice: amount,
                status: 'PENDING',
                items: {
                    create: cart.items.map((item) => ({
                        foodItemId: item.foodItemId,
                        quantity: item.quantity,
                        price: item.foodItem.price
                    }))
                }
            }
        })


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Food Order' },
                        unit_amount: amount * 100,
                    },
                    quantity: 1
                }
            ],
            success_url: `${baseUrl}/payment-success`,
            cancel_url: `${baseUrl}/payment-cancelled`,
        })
        res.send({ url: session.url });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!!!' });
        return;
    }
})

router.get('/orders', async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await prisma.order.findMany({ 
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                totalPrice: true,
                status: true,
                items: {
                    select: { id: true }
                }
            }
        });
        const OrdersData = orders.map(order => ({
            id: order.id,
            createdAt: order.createdAt,
            totalPrice: order.totalPrice,
            status: order.status,
            itemCount: order.items.length
        }))
        res.status(200).json(OrdersData);
        return;
    } catch(err) {
        res.status(500).json({ message: 'Failed to fetch orders'});
        return;
    }
})

router.get('/order/:orderId', async (req, res) => {
    try {
        const userId = req.user?.id;
        const { orderId } = req.params

        const orderDetail = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: { foodItem: true }
                },
                payment: true,
                delivery: true
            }
        })

        if (!orderDetail || orderDetail.userId !== userId) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json(orderDetail);
        return;


    } catch(err) {
        res.status(500).json({ message: 'Failed to fetch order details' });
        return;
    }
})


export default router;