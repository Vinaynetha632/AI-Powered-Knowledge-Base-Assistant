# DEBUG_NOTES.md

# Debug Notes

This document describes some of the issues I encountered while developing this project, along with how I identified and resolved them.

---

# Issue 1: MongoDB Connection Failed

## Problem

When starting the backend server, MongoDB was not connecting and the server displayed the following error:

```
MongoDB Connection Error:
querySrv ECONNREFUSED
```

---

## Root Cause

The database connection string and DNS configuration were not working correctly with MongoDB Atlas. Because of this, the application could not establish a connection with the database.

---

## Investigation

- Verified the MongoDB connection string.
- Checked the database username and password.
- Confirmed Network Access settings in MongoDB Atlas.
- Tested DNS resolution using `nslookup`.
- Verified the cluster was running.

---

## Solution

Updated the MongoDB connection string with the correct credentials and database name.

After correcting the configuration, the backend connected successfully to MongoDB Atlas.

---

# Issue 2: Gemini API Model Error

## Problem

While asking questions from uploaded documents, the backend returned an API error because the selected Gemini model was not available for the generated API key.

---

## Root Cause

The initial model configuration was incorrect for the available API version.

---

## Investigation

- Checked the API response.
- Verified the API key.
- Tested different Gemini models.
- Reviewed the official Gemini documentation.

---

## Solution

Updated the application to use the supported Gemini model.

After updating the model configuration, AI responses were generated successfully.

---

# Issue 3: PDF Upload Failed

## Problem

Some PDF files were uploaded successfully, but no text was extracted from them.

As a result, the AI assistant could not answer questions related to those documents.

---

## Root Cause

The uploaded PDF was a scanned image instead of a text-based PDF.

The parser could only extract text from digital PDF documents.

---

## Investigation

- Checked the extracted text stored in MongoDB.
- Verified the uploaded PDF manually.
- Compared text-based PDFs with scanned PDFs.

---

## Solution

Added validation to check whether text was successfully extracted.

If no text is found, the application displays a user-friendly message asking the user to upload a text-based document.

---

# Issue 4: Unauthorized API Requests

## Problem

Protected API endpoints were returning **401 Unauthorized** even after login.

---

## Root Cause

The frontend was not sending the JWT token in the Authorization header for every protected request.

---

## Investigation

- Verified login response.
- Checked browser Local Storage.
- Inspected request headers using Developer Tools.
- Confirmed the backend authentication middleware was working correctly.

---

## Solution

Configured Axios to automatically attach the JWT token in every protected request using an Authorization Bearer header.

After this change, protected APIs started working correctly.

---

# Issue 5: Invalid File Upload

## Problem

Users were able to select unsupported file formats such as images and executable files.

---

## Root Cause

File validation was not properly configured in the upload middleware.

---

## Investigation

- Tested uploading different file formats.
- Verified MIME types.
- Reviewed Multer configuration.

---

## Solution

Restricted uploads to only the required file formats:

- PDF
- TXT
- Markdown

Unsupported files now display a meaningful validation message.

---

# Testing Performed

After implementing all features, the application was tested manually.

The following functionality was verified:

### Authentication

- User Registration
- User Login
- JWT Authentication
- Logout

---

### Document Upload

- Upload PDF
- Upload TXT
- Upload Markdown
- Invalid File Upload

---

### AI Question Answering

- Ask questions based on uploaded documents
- Verify Gemini responses
- Verify fallback message when the answer is not available

---

### Chat History

- Save conversations
- Display previous conversations
- Verify timestamps

---

### Dashboard

Verified:

- Total Documents
- Total Questions
- Recent Uploads
- Recent Conversations

---

### Error Handling

Tested:

- Invalid Login
- Unauthorized Access
- Invalid Upload
- Unsupported File Type
- Database Connection Errors
- Gemini API Errors

---

# Summary

The issues encountered during development helped improve the stability and reliability of the application. Each issue was investigated, tested, and resolved before the final submission to ensure the application works as expected.