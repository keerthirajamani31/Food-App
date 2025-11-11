import FoodModel from '../models/FoodModel.js';

// GET - Get all food items
export const getFood = async (req, res) => {
  try {
    const foods = await FoodModel.find({});
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// GET - Get single food item by ID
export const getSingleFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await FoodModel.findById(id);
    
    if (!food) {
      return res.status(404).json({ 
        success: false,
        message: "Food item not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: food
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// GET - Get food by category
export const getFoodByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid category',
        validCategories: validCategories 
      });
    }
    
    const foods = await FoodModel.find({ category: category });
    
    res.status(200).json({
      success: true,
      count: foods.length,
      category: category,
      data: foods
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// POST - Create new food item
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category,  rating, ingredients, image, varieties } = req.body;

    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, description, price and category are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price cannot be negative!' 
      });
    }

    const newFood = new FoodModel({
      name,
      description,
      price,
      category,
      rating: rating || 4.5,
      ingredients: ingredients || [],
      image: image || '',
      varieties: varieties || []
    });

    const savedFood = await newFood.save();
    
    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: savedFood
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// PUT - Update food item by ID
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.price && req.body.price < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price cannot be negative!' 
      });
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ 
        success: false,
        message: "Food item not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: updatedFood
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// DELETE - Delete food item by ID
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await FoodModel.findByIdAndDelete(id);
    
    if (!deletedFood) {
      return res.status(404).json({ 
        success: false,
        message: "Food item not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      data: deletedFood
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// GET - Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];
    res.status(200).json({
      success: true,
      categories: categories
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}