const Conversation = require('../models/Conversation');
const Document = require('../models/Document');
const { askGemini } = require('../services/geminiService');

/**
 * @desc    Submit a question about a document to the Gemini API and save conversation
 * @route   POST /ask
 * @access  Private
 */
const askQuestion = async (req, res, next) => {
  const { documentId, question } = req.body;

  try {
    // 1. Validate input parameters
    if (!documentId || !question || !question.trim()) {
      res.status(400);
      throw new Error('Please select a document and enter a question.');
    }

    // 2. Retrieve document and verify ownership
    const document = await Document.findOne({
      _id: documentId,
      owner: req.user._id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Selected document not found or unauthorized.');
    }

    // 3. Request answer from Gemini
    const answer = await askGemini(document.extractedContent, question);

    // 4. Save question and answer to chat history
    const conversation = await Conversation.create({
      user: req.user._id,
      document: documentId,
      question: question.trim(),
      answer: answer,
    });

    // Populate document metadata before sending response
    const populatedConv = await Conversation.findById(conversation._id).populate('document', 'title fileType');

    res.status(200).json({
      success: true,
      conversation: populatedConv,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get conversation history for the authenticated user
 * @route   GET /history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  const { search } = req.query;

  try {
    // Retrieve all conversations for user, populated with document info
    const conversations = await Conversation.find({ user: req.user._id })
      .populate('document', 'title fileType')
      .sort({ timestamp: -1 });

    let results = conversations;

    // Filter conversations if search term is provided
    if (search && search.trim() !== '') {
      const query = search.toLowerCase();
      results = conversations.filter((conv) => {
        const docTitle = conv.document ? conv.document.title.toLowerCase() : '';
        const questionText = conv.question.toLowerCase();
        const answerText = conv.answer.toLowerCase();

        return (
          docTitle.includes(query) ||
          questionText.includes(query) ||
          answerText.includes(query)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      history: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getHistory,
};
