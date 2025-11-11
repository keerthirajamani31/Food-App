import express from 'express';
import {addFood, getFood, getSingleFood, updateFood,deleteFood} from '../Controllers/useControllers.js';

const router = express.Router();

router.get('/all', getFood);
router.get('/:id', getSingleFood);
router.post('/', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;