import express from 'express';
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../Controllers/registerController.js';

const router = express.Router();

router.get('/all', getAllUsers);
router.get('/:id', getUserById);
router.post('/', registerUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

export default router;