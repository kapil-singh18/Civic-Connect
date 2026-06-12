import { Router } from 'express';
import {
  createIssue,
  deleteIssue,
  getIssue,
  getIssues,
  getTracking,
  replyToIssue,
  updateIssue,
  updateProgress
} from '../controllers/issueController.js';
import { authorize, protect } from '../middlewares/auth.js';

const router = Router();

router.use(protect);
router.route('/').post(authorize('citizen'), createIssue).get(getIssues);
router.get('/:id/tracking', getTracking);
router.put('/:id/progress', authorize('admin'), updateProgress);
router.post('/:id/replies', authorize('admin'), replyToIssue);
router.route('/:id').get(getIssue).put(authorize('admin'), updateIssue).delete(authorize('admin'), deleteIssue);

export default router;
