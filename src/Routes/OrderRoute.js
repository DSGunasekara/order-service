import express from 'express';
const router = express.Router();

import  {getOrder, getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/OrderController.js';

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;