import express, { Request, Response } from 'express';
import { authenticate, AuthorizeUser } from '../middlewares/authMiddleware';
import prisma from '../lib/prismaClient';


const router = express.Router();

router.use(authenticate, AuthorizeUser);

// Get cart items
router.get('/', async (req, res) => {
    const userId = req.user?.id;

    try {
        const cart = await prisma.cart.findUnique({
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
        })
        res.json(cart?.items || []);
        return;
    } catch(err) {
        res.status(500).json({message: "Failed to fetch cart"});
        return;
    }
})

// Add item to cart
router.post('/add', async (req, res) => {
    const userId = req.user?.id;
    const { foodItemId, quantity } = req.body;

    if (!userId) {
        res.status(201).json({message: "Unauthorized"});
        return;
    }

    try {
        let cart = await prisma.cart.findUnique({
            where: { userId }
        })
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            })
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                foodItemId
            }
        });

        if (existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
            res.json(updatedItem);
            return;
        };

        const newItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                foodItemId,
                quantity
            }
        })
        res.json(newItem);
        return;

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Failed to add to cart"});
        return;
    }
})

//  Update item quantity

router.put('/update', async (req, res) => {
    const userId = req.user?.id;
    const { foodItemId, quantity } = req.body;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId }
        })
        if(!cart) {
            res.status(404).json({message: "Cart not found"});
            return;
        }

        const item = await prisma.cartItem.findFirst({ where: { cartId: cart?.id, foodItemId }})
        if (!item) {
            res.status(404).json({message: "Item not in cart"});
            return;
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity }
        })

        res.json(updatedItem);
        return;
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'Faied to update the item'});
        return;
    }
})

//  Remove item  from cart 
router.delete('/remove/:foodItemId', async (req, res) => {
    const userId = req.user?.id;
    const { foodItemId } = req.params;

    try {
        const cart = await prisma.cart.findUnique({ where: { userId }});
        if(!cart) {
            res.status(404).json({message: "Cart not found"});
            return;
        }

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id, foodItemId }
        })
        res.json({message: "Item removed from cart"});
        return;
    } catch(err) {
        res.status(500).json({error: "Failed to remove item"});
        return;
    }
})


// Clear cart
router.delete('removeCart', async (req, res) => {
    const userId = req.user?.id;

    try {
        const cart = await prisma.cart.findUnique({ where: { userId }});
        if (!cart) {
            res.status(404).json({error: 'Cart not found'});
            return;
        }

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id }});
        res.json({message: "Cart cleared"});
        return;
    } catch(err) {
        res.status(500).json({error: "Failed to clear cart"});
        return;
    }
})
export default router;