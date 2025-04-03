import express from "express";
import { authenticate, AuthorizeAdmin } from "../middlewares/authMiddleware";



const router = express.Router();

router.get('/dashboard', authenticate, AuthorizeAdmin, (req, res) => {

})

export default router;