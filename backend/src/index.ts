import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes';
import userRoute from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import { prisma } from './config/database';

dotenv.config()

const app = express();

app.use(json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.get('/foodList', (req, res) => {
    try {
        const foodList = prisma.foodItem.findMany();
        res.json(foodList);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
})


app.use('/admin', adminRoutes);
app.use('/user', userRoute);
app.use('/cart', cartRoutes);

app.listen(3000, () => {
    console.log('App is listening at port 3000');
})