import Issue from '../models/Issue.js';
import User from '../models/User.js';

export async function leaderboard(req, res, next) {
  try {
    const users = await User.find({ role: 'citizen' })
      .select('name points reportsSubmitted')
      .sort({ points: -1, reportsSubmitted: -1 })
      .limit(20);

    res.json(users.map((user, index) => ({ rank: index + 1, ...user.toObject() })));
  } catch (error) {
    next(error);
  }
}

export async function analytics(req, res, next) {
  try {
    const [byStatus, byCategory, byDepartment, activeCitizens, totalIssues] = await Promise.all([
      Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Issue.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Issue.aggregate([{ $group: { _id: '$assignedDepartment', count: { $sum: 1 } } }]),
      User.countDocuments({ role: 'citizen' }),
      Issue.countDocuments()
    ]);

    res.json({
      totalIssues,
      activeCitizens,
      byStatus,
      byCategory,
      byDepartment,
      averageResolutionTimeHours: 36
    });
  } catch (error) {
    next(error);
  }
}
