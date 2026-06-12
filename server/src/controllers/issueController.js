import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToAdmins, emitToUser } from '../sockets/index.js';
import { assignDepartment, calculatePriority } from '../utils/routing.js';

async function notify(userId, { title, message, issueId, senderId, type = 'system' }) {
  const notification = await Notification.create({ userId, title, message, issueId, senderId, type });
  const populated = await notification.populate([
    { path: 'issueId', select: 'title category priority status location createdAt' },
    { path: 'senderId', select: 'name email phone role city area' }
  ]);
  emitToUser(userId, 'notification:new', populated);
  return notification;
}

async function findPrimaryAdmin() {
  return User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
}

export async function createIssue(req, res, next) {
  try {
    const { title, description, category, priority, imageUrl, location } = req.body;
    const issue = await Issue.create({
      title,
      description,
      category,
      priority: calculatePriority(category, priority),
      imageUrl,
      location,
      reportedBy: req.user._id,
      assignedDepartment: assignDepartment(category),
      progress: [{ step: 'Report Submitted', updatedBy: req.user._id, comments: 'Issue submitted by citizen.' }]
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10, reportsSubmitted: 1 } });
    await notify(req.user._id, {
      title: 'Report Submitted',
      message: `Your issue "${issue.title}" was submitted.`,
      issueId: issue._id,
      senderId: req.user._id,
      type: 'progress'
    });

    const admin = await findPrimaryAdmin();
    if (admin) {
      await notify(admin._id, {
        title: 'New Citizen Report',
        message: `${req.user.name} reported "${issue.title}" in ${issue.location.address}.`,
        issueId: issue._id,
        senderId: req.user._id,
        type: 'new_report'
      });
    }
    emitToAdmins('issue:new', issue);

    res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
}

export async function getIssues(req, res, next) {
  try {
    const filter = {};
    const { category, priority, status, search, mine } = req.query;

    if (req.user.role === 'citizen' || mine === 'true') filter.reportedBy = req.user._id;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email phone role city area')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    next(error);
  }
}

export async function getIssue(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email phone role city area')
      .populate('progress.updatedBy', 'name role city area')
      .populate('replies.sentBy', 'name role city area');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (req.user.role === 'citizen' && String(issue.reportedBy._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(issue);
  } catch (error) {
    next(error);
  }
}

export async function updateIssue(req, res, next) {
  try {
    const allowed = ['priority', 'status', 'assignedDepartment', 'adminNotes'];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const issue = await Issue.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('reportedBy', 'name email');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    await notify(issue.reportedBy._id, {
      title: 'Issue Updated',
      message: `Your issue "${issue.title}" was updated.`,
      issueId: issue._id,
      senderId: req.user._id,
      type: 'progress'
    });
    emitToAdmins('issue:updated', issue);

    res.json(issue);
  } catch (error) {
    next(error);
  }
}

export async function deleteIssue(req, res, next) {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getTracking(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id).populate('progress.updatedBy', 'name role');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue.progress);
  } catch (error) {
    next(error);
  }
}

export async function updateProgress(req, res, next) {
  try {
    const { step, comments = '' } = req.body;
    const statusByStep = {
      Acknowledged: 'Acknowledged',
      Assigned: 'Assigned',
      'Work Started': 'In Progress',
      'Work Completed': 'In Progress',
      Resolved: 'Resolved'
    };

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.progress.push({ step, comments, updatedBy: req.user._id });
    issue.status = statusByStep[step] || issue.status;
    await issue.save();
    await notify(issue.reportedBy, {
      title: 'Progress Updated',
      message: `Progress updated for "${issue.title}": ${step}.`,
      issueId: issue._id,
      senderId: req.user._id,
      type: 'progress'
    });
    emitToAdmins('issue:progress', issue);

    res.json(issue);
  } catch (error) {
    next(error);
  }
}

export async function replyToIssue(req, res, next) {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Reply message is required' });

    const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name email phone role city area');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.replies.push({ message, sentBy: req.user._id });
    issue.progress.push({ step: 'Acknowledged', comments: message, updatedBy: req.user._id });
    if (issue.status === 'Pending') issue.status = 'Acknowledged';
    await issue.save();

    await notify(issue.reportedBy._id, {
      title: 'Admin Reply',
      message,
      issueId: issue._id,
      senderId: req.user._id,
      type: 'admin_reply'
    });

    const populated = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email phone role city area')
      .populate('progress.updatedBy', 'name role city area')
      .populate('replies.sentBy', 'name role city area');

    emitToUser(issue.reportedBy._id, 'issue:reply', populated);
    emitToAdmins('issue:updated', populated);
    res.json(populated);
  } catch (error) {
    next(error);
  }
}
