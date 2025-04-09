import express from "express";
import multer from 'multer';
import { authenticate, AuthorizeAdmin } from "../middlewares/authMiddleware";
import { bucket } from "../config/firebase";
import prisma from "../lib/prismaClient";



const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-food', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const file = req.file;

        if(!file) {
            res.status(400).json({message: "File not uploaded"});
            return;
        }

        const fileName = `food-image/${Date.now()}-${file.originalname}`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype }
        })

        blobStream.end(file.buffer);

        blobStream.on('finish', async() => {

            await blob.makePublic();
            
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            const food = await prisma.foodItem.create({
                data: {
                    name,
                    description,
                    price,
                    category,
                    imageUrl
                }
            });
            res.status(201).json({message: "Food item added", food });
            return;
        });

        blobStream.on('error', (err) => {
            res.status(500).json({message: "Upload failed", details: err.message });
            return;
        });
    } catch(err) {
        res.status(500).json({ error: "Something went wrong", details: err });
        return;
    }
});



router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                totalPrice: true,
                status: true,
                createdAt: true
            }
        });
        res.status(200).json(orders);
        return;
    } catch(err) {
        res.status(500).json({message: "Failed to fetch orders"});
        return;
    }
})

router.patch('/order/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const allowedStatus = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
    if (!allowedStatus.includes(newStatus)) {
        res.status(400).json({ message: 'Invalid status value'});
        return;
    }
   
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        res.status(200).json({ message: "Order status updated successfully", updatedOrder });
        return;

    } catch (err) {
        res.status(500).json({message: "Failed to update order status"});
        return;
    }
})

export default router;