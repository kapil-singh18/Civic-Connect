import { Router } from 'express';
import { analytics, leaderboard } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middlewares/auth.js';

const router = Router();

router.get('/leaderboard', protect, leaderboard);
router.get('/analytics', protect, authorize('admin'), analytics);

export default router;
