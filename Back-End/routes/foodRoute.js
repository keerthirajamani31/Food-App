import express from 'express';
import {addFood, getFood, getSingleFood, updateFood,deleteFood} from '../Controllers/useControllers.js';

const router = express.Router();

// Base route - GET /api/food
router.get('/', (req, res) => {
  res.json({ 
    message: 'Food API is working!',
    endpoints: {
      allFood: '/api/food/all',
      singleFood: '/api/food/:id',
      addFood: 'POST /api/food',
      updateFood: 'PUT /api/food/:id',
      deleteFood: 'DELETE /api/food/:id'
    }
  });
});

// Your existing routes
router.get('/all', getFood);
router.get('/:id', getSingleFood);
router.post('/', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;