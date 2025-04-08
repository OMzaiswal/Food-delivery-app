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
            res.status(201).json({message: "Food item added", food })
        });

        blobStream.on('error', (err) => {
            res.status(500).json({message: "Upload failed", details: err.message });
        });
    } catch(err) {
        res.status(500).json({ error: "Something went wrong", details: err });
    }
});



router.get('/dashboard', authenticate, AuthorizeAdmin, (req, res) => {

})

export default router;