import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationMeta } from '../utils/paginate.js';

export const getActivities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('project task', 'name')
    .skip(skip)
    .limit(parseInt(limit));

  const totalActivities = await Activity.countDocuments({ user: req.user._id });

  const pagination = buildPaginationMeta(page, limit, totalActivities);

  res.status(200).json({
    success: true,
    message: activities,
    pagination,
  });
});