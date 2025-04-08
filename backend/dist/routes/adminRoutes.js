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
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const firebase_1 = require("../config/firebase");
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/add-food', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "File not uploaded" });
            return;
        }
        const fileName = `food-image/${Date.now()}-${file.originalname}`;
        const blob = firebase_1.bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype }
        });
        blobStream.end(file.buffer);
        blobStream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            yield blob.makePublic();
            const imageUrl = `https://storage.googleapis.com/${firebase_1.bucket.name}/${blob.name}`;
            const food = yield prismaClient_1.default.foodItem.create({
                data: {
                    name,
                    description,
                    price,
                    category,
                    imageUrl
                }
            });
            res.status(201).json({ message: "Food item added", food });
        }));
        blobStream.on('error', (err) => {
            res.status(500).json({ message: "Upload failed", details: err.message });
        });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong", details: err });
    }
}));
router.get('/dashboard', authMiddleware_1.authenticate, authMiddleware_1.AuthorizeAdmin, (req, res) => {
});
exports.default = router;
