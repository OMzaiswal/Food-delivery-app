"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/login', (req, res) => {
    res.json({ message: "Login in route" });
});
router.get('/dashboard', authMiddleware_1.authenticate, authMiddleware_1.AuthorizeUser, (req, res) => {
});
exports.default = router;
