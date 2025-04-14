"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeUser = exports.AuthorizeAdmin = exports.authenticate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json('Authentication token not found, Please log in');
            return;
        }
        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not set in environment variable');
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid or expired cookie, please login again' });
        return;
    }
};
exports.authenticate = authenticate;
const AuthorizeAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Admins only allowed' });
        return;
    }
    next();
};
exports.AuthorizeAdmin = AuthorizeAdmin;
const AuthorizeUser = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'user') {
        res.status(403).json({ message: 'Forbidden: Users Only' });
        return;
    }
    next();
};
exports.AuthorizeUser = AuthorizeUser;
