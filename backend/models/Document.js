const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
  },
  fileName: {
    type: String,
    required: [true, 'Physical filename is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['pdf', 'txt', 'md'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Document owner is required'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    size: Number,
    encoding: String,
    pageCount: Number,
  },
  extractedContent: {
    type: String,
    required: [true, 'Extracted text content is required'],
  },
});

module.exports = mongoose.model('Document', documentSchema);
