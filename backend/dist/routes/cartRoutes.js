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
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate, authMiddleware_1.AuthorizeUser);
// Get cart items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const cart = yield prismaClient_1.default.cart.findUnique({
            where: {
                userId
            },
            include: {
                items: {
                    include: {
                        foodItem: true
                    }
                }
            }
        });
        res.json((cart === null || cart === void 0 ? void 0 : cart.items) || []);
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch cart" });
        return;
    }
}));
// Add item to cart
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { foodItemId, quantity } = req.body;
    if (!userId) {
        res.status(201).json({ message: "Unauthorized" });
        return;
    }
    try {
        let cart = yield prismaClient_1.default.cart.findUnique({
            where: { userId }
        });
        if (!cart) {
            cart = yield prismaClient_1.default.cart.create({
                data: { userId }
            });
        }
        const existingItem = yield prismaClient_1.default.cartItem.findFirst({
            where: {
                cartId: cart.id,
                foodItemId
            }
        });
        if (existingItem) {
            const updatedItem = yield prismaClient_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
            res.json(updatedItem);
            return;
        }
        ;
        const newItem = yield prismaClient_1.default.cartItem.create({
            data: {
                cartId: cart.id,
                foodItemId,
                quantity
            }
        });
        res.json(newItem);
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add to cart" });
        return;
    }
}));
//  Update item quantity
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const { foodItemId, quantity } = req.body;
    try {
        const cart = yield prismaClient_1.default.cart.findUnique({
            where: { userId }
        });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const item = yield prismaClient_1.default.cartItem.findFirst({ where: { cartId: cart === null || cart === void 0 ? void 0 : cart.id, foodItemId } });
        if (!item) {
            res.status(404).json({ message: "Item not in cart" });
            return;
        }
        const updatedItem = yield prismaClient_1.default.cartItem.update({
            where: { id: item.id },
            data: { quantity }
        });
        res.json(updatedItem);
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Faied to update the item' });
        return;
    }
}));
//  Remove item  from cart 
router.delete('/remove/:foodItemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const { foodItemId } = req.params;
    try {
        const cart = yield prismaClient_1.default.cart.findUnique({ where: { userId } });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        yield prismaClient_1.default.cartItem.deleteMany({
            where: { cartId: cart.id, foodItemId }
        });
        res.json({ message: "Item removed from cart" });
        return;
    }
    catch (err) {
        res.status(500).json({ error: "Failed to remove item" });
        return;
    }
}));
// Clear cart
router.delete('removeCart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
    try {
        const cart = yield prismaClient_1.default.cart.findUnique({ where: { userId } });
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        yield prismaClient_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
        res.json({ message: "Cart cleared" });
        return;
    }
    catch (err) {
        res.status(500).json({ error: "Failed to clear cart" });
        return;
    }
}));
exports.default = router;
