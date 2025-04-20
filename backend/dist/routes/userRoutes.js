"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("stripe"));
const router = (0, express_1.Router)();
const SECRET_KEY = process.env.JWT_SECRET;
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not set in the environment variables!');
}
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email },
            include: {
                cart: {
                    include: {
                        items: true
                    }
                }
            }
        });
        if (!user) {
            res.status(404).json({ message: "User does not exist" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password, Try again!" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: 'user' }, SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const cart = {};
        (_a = user.cart) === null || _a === void 0 ? void 0 : _a.items.forEach(item => {
            cart[item.foodItemId] = item.quantity;
        });
        res.status(200).json({ message: "Logged in successfully", fullName: user.fullName, cart });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
router.get('/dashboard', authMiddleware_1.authenticate, authMiddleware_1.AuthorizeUser, (req, res) => {
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }
    try {
        const existingUser = yield prismaClient_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prismaClient_1.default.user.create({
            data: { fullName, email, password: hashedPassword }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: 'user' }, SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: 'User registered successfully!', token });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Internal Server error");
        return;
    }
}));
router.use(authMiddleware_1.authenticate, authMiddleware_1.AuthorizeUser);
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        res.status(200).json({ message: "User logged out successfully" });
        return;
    }
    catch (err) {
        console.log('Error clearing cookie', err);
        res.status(500).json({ message: "Unable to logout" });
        return;
    }
});
router.get('/auth/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id },
            include: {
                cart: {
                    include: {
                        items: true
                    }
                }
            }
        });
        const cart = {};
        (_c = user === null || user === void 0 ? void 0 : user.cart) === null || _c === void 0 ? void 0 : _c.items.forEach(item => {
            cart[item.foodItemId] = item.quantity;
        });
        res.status(200).json({ message: 'User is logged in', fullName: user === null || user === void 0 ? void 0 : user.fullName, cart });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
    }
}));
router.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    try {
        const session = yield stripe.checkout.sessions.create({
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
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-cancelled',
        });
        res.send({ url: session.url });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!!!' });
        return;
    }
}));
exports.default = router;
