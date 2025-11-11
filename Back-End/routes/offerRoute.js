import express from 'express';
import {
  getSpecialOffers,
  getSpecialOfferById,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer
} from '../Controllers/offerController.js';

const router = express.Router();

router.get('/', getSpecialOffers);
router.get('/:id', getSpecialOfferById);
router.post('/', createSpecialOffer);
router.put('/:id', updateSpecialOffer);
router.delete('/:id', deleteSpecialOffer);

export default router;