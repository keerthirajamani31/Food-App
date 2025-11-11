import mongoose from 'mongoose';

const varietySchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  rating: Number,
  ingredients: [String],
  image: String
});

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number, 
  category: String, 
  subCategory: String, 
  rating: Number, 
  ingredients: [String],
  image: String,
  varieties: [varietySchema]
}, {
  timestamps: true 
});

export default mongoose.model('Food', FoodSchema);