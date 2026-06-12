import { Router } from 'express';
import { login, profile, refresh, register } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', protect, profile);

export default router;
