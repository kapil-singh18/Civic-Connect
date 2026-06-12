import Notification from '../models/Notification.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('issueId', 'title category priority status location createdAt')
      .populate('senderId', 'name email phone role city area')
      .sort({ createdAt: -1 })
      .limit(80);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
}
