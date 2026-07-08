const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

/**
 * 
 * @param {string} filePath 
 * @param {string} originalName 
 * @returns {Promise<{text: string, pageCount: number}>}
 */
const parseDocument = async (filePath, originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  try {
    if (ext === '.pdf') {
      const fileBuffer = await fs.readFile(filePath);
      
      const parser = new pdf.PDFParse({ data: fileBuffer });
      const data = await parser.getText();
      
      if (!data || !data.text) {
        throw new Error('Could not extract text from the PDF file. It may be empty or contain only images.');
      }
      
      return {
        text: data.text.trim(),
        pageCount: data.total || 1
      };
    } else if (ext === '.txt' || ext === '.md' || ext === '.markdown') {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (!content || content.trim() === '') {
        throw new Error('The uploaded text/markdown file is empty.');
      }
      
      return {
        text: content.trim(),
        pageCount: 1
      };
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  } catch (error) {
    console.error('Error during file parsing:', error.message);
    throw new Error(error.message || 'File parsing failed.');
  }
};

module.exports = { parseDocument };
