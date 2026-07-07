const fs = require('fs').promises;
const path = require('path');
const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const { parseDocument } = require('../services/parserService');

/**
 * @desc    Upload new document and extract content
 * @route   POST /documents
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    // 1. Ensure file exists in request
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file. Supported formats: PDF, TXT, MD.');
    }

    const { path: tempPath, originalname, size, mimetype } = req.file;

    // 2. Determine file type
    let fileType = 'txt';
    const ext = path.extname(originalname).toLowerCase();
    if (ext === '.pdf') fileType = 'pdf';
    if (ext === '.md' || ext === '.markdown') fileType = 'md';

    // 3. Parse and extract text content
    const parseResult = await parseDocument(tempPath, originalname);

    // 4. Save document record in DB
    const document = await Document.create({
      title: originalname,
      fileName: req.file.filename,
      fileType: fileType,
      owner: req.user._id,
      metadata: {
        size: size,
        encoding: 'utf-8',
        pageCount: parseResult.pageCount,
      },
      extractedContent: parseResult.text,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and parsed successfully.',
      document: {
        _id: document._id,
        title: document.title,
        fileName: document.fileName,
        fileType: document.fileType,
        metadata: document.metadata,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    // Clean up file from server storage in case of failure
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete temp file on error:', unlinkError.message);
      }
    }
    next(error);
  }
};

/**
 * @desc    Get all documents for the authenticated user
 * @route   GET /documents
 * @access  Private
 */
const getDocuments = async (req, res, next) => {
  const { search } = req.query;

  try {
    let query = { owner: req.user._id };

    // Apply search filter if query is provided
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const documents = await Document.find(query)
      .select('-extractedContent') // Exclude heavy text content for performance
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single document by ID (with extracted content for preview)
 * @route   GET /documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found or you are not authorized to view it.');
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a document, its physical file, and associated chat history
 * @route   DELETE /documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    // Find the document and check ownership
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found or you do not have permission to delete it.');
    }

    // 1. Delete the physical file from disk
    const filePath = path.join(__dirname, '../uploads', document.fileName);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Physical file ${document.fileName} not found on disk, skipping file unlink.`, err.message);
    }

    // 2. Delete the document record from MongoDB
    await Document.deleteOne({ _id: document._id });

    // 3. Delete all conversations related to this document
    await Conversation.deleteMany({ document: document._id });

    res.status(200).json({
      success: true,
      message: 'Document and its chat history deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
