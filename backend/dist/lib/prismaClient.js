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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeConnectPrisma = void 0;
const client_1 = require("@prisma/client");
// Avoid multiple Prisma instances during development (hot reload)
const globalForPrisma = globalThis;
const prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
// Retry wrapper in case Neon is cold or slow to respond
function safeConnectPrisma(retries = 5, delay = 2000) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < retries; i++) {
            try {
                yield prisma.$connect();
                console.log("✅ Prisma connected.");
                return prisma;
            }
            catch (err) {
                console.warn(`🔁 Retry ${i + 1} failed. Retrying in ${delay}ms...`);
                if (i === retries - 1)
                    throw err;
                yield new Promise((res) => setTimeout(res, delay));
            }
        }
    });
}
exports.safeConnectPrisma = safeConnectPrisma;
exports.default = prisma;
