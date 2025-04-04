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
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not set in the environment variables!');
}
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const user = yield database_1.prisma.user.findUnique({
            where: {
                email
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Logged in successfully" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get('/dashboard', authMiddleware_1.authenticate, authMiddleware_1.AuthorizeUser, (req, res) => {
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }
    try {
        const existingUser = yield database_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield database_1.prisma.user.create({
            data: { fullName, email, password: hashedPassword, role }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '7d' });
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
exports.default = router;
