const Document = require('../models/Document');
const Conversation = require('../models/Conversation');

/**
 * @desc    Get dashboard metrics and lists of recent activities
 * @route   GET /dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch total counts
    const totalDocuments = await Document.countDocuments({ owner: userId });
    const totalQuestions = await Conversation.countDocuments({ user: userId });

    // 2. Fetch recent uploads (limit to 5, exclude bulky content)
    const recentUploads = await Document.find({ owner: userId })
      .select('-extractedContent')
      .sort({ uploadedAt: -1 })
      .limit(5);

    // 3. Fetch recent conversations (limit to 5, populated with document details)
    const recentConversations = await Conversation.find({ user: userId })
      .populate('document', 'title fileType')
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalDocuments,
        totalQuestions,
      },
      recentUploads,
      recentConversations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
