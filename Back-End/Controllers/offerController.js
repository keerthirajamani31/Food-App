import offerModel from "../models/offerModel.js";

// GET - Get all special offers
export const getSpecialOffers = async (req, res) => {
  try {
    const offers = await offerModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// GET - Get single special offer by ID
export const getSpecialOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await offerModel.findById(id);
    
    if (!offer) {
      return res.status(404).json({ 
        success: false,
        message: "Special offer not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// POST - Create new special offer
export const createSpecialOffer = async (req, res) => {
  try {
    const { image, title, rating, description, price } = req.body;

    // Basic validation
    if (!image || !title || !description || !price) {
      return res.status(400).json({ 
        success: false,
        message: 'Image, title, description and price are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price cannot be negative!' 
      });
    }

    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be between 0 and 5' 
      });
    }

    const newOffer = new offerModel({
      image,
      title,
      rating: rating || 4.5,
      description,
      price
    });

    const savedOffer = await newOffer.save();
    
    res.status(201).json({
      success: true,
      message: "Special offer created successfully",
      data: savedOffer
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// PUT - Update special offer by ID
export const updateSpecialOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.price && req.body.price < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price cannot be negative!' 
      });
    }

    if (req.body.rating && (req.body.rating < 0 || req.body.rating > 5)) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be between 0 and 5' 
      });
    }

    const updatedOffer = await offerModel.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ 
        success: false,
        message: "Special offer not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Special offer updated successfully",
      data: updatedOffer
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}

// DELETE - Delete special offer by ID (soft delete)
export const deleteSpecialOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await offerModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!deletedOffer) {
      return res.status(404).json({ 
        success: false,
        message: "Special offer not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Special offer deleted successfully",
      data: deletedOffer
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}