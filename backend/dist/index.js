"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const prismaClient_1 = __importStar(require("./lib/prismaClient"));
const redis_1 = require("./upstash/redis");
const cacheKey_1 = require("./constants/cacheKey");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, body_parser_1.json)());
app.use((0, cookie_parser_1.default)());
const devOrigions = ['http://localhost:5173'];
const prodOrigins = ['https://hungerbox.online', 'https://www.hungerbox.online'];
const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigions;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.get('/foodList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('gfgfiygkhgkj')
    const start = performance.now();
    try {
        const cachedFood = yield redis_1.redis.get(cacheKey_1.CACHE_KEYs.FOOD_LIST);
        if (cachedFood) {
            const end = performance.now();
            res.set({
                'X-Cache': 'HIT',
                'X-Response-Time': `${(end - start).toFixed(2)}ms`
            });
            // console.log('HITTTT')
            res.status(200).json(cachedFood);
            return;
        }
        const foodList = yield prismaClient_1.default.foodItem.findMany();
        yield redis_1.redis.set(cacheKey_1.CACHE_KEYs.FOOD_LIST, foodList, { ex: 86400 });
        const end = performance.now();
        res.set({
            'X-Cache': 'MISS',
            'X-Response-Time': `${(end - start).toFixed(2)}ms`,
            'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=300'
        });
        // console.log('MISSS')
        res.status(200).json(foodList);
        return;
    }
    catch (err) {
        // console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
app.use('/admin', adminRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
// ✅ Start server only after DB connection
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, prismaClient_1.safeConnectPrisma)(); // Ensure DB is connected (even if cold-start)
            app.listen(PORT, () => {
                console.log(`✅ Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error("❌ Failed to start server due to DB connection error:", error);
            process.exit(1);
        }
    });
}
startServer();
