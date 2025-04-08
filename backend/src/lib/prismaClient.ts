import { PrismaClient } from "@prisma/client";

// Avoid multiple Prisma instances during development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Retry wrapper in case Neon is cold or slow to respond
export async function safeConnectPrisma(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log("✅ Prisma connected.");
      return prisma;
    } catch (err) {
      console.warn(`🔁 Retry ${i + 1} failed. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export default prisma;
