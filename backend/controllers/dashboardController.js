const Document = require('../models/Document');
const Conversation = require('../models/Conversation');

/**
 * @desc    
 * @route 
 * @access  
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalDocuments = await Document.countDocuments({ owner: userId });
    const totalQuestions = await Conversation.countDocuments({ user: userId });

    const recentUploads = await Document.find({ owner: userId })
      .select('-extractedContent')
      .sort({ uploadedAt: -1 })
      .limit(5);

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
