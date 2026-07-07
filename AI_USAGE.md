# AI Usage

## Overview

Artificial Intelligence was used as a development assistant during this project. It helped in understanding concepts, generating initial code suggestions, fixing errors, and improving productivity. Every feature was reviewed, tested, and modified where necessary before being added to the project.

The final implementation was manually verified to ensure that the application works as expected.

---

# AI Tools Used

The following AI tools were used during development:

- ChatGPT
- Google Gemini API (for document question answering inside the application)

---

# How AI Was Used

AI was mainly used for the following tasks:

- Understanding project requirements
- Planning the overall project structure
- Getting suggestions for React and Express implementation
- Learning new concepts during development
- Debugging runtime errors
- Improving code readability
- Writing better error handling
- Creating project documentation

AI was used as a learning and productivity tool, while the final implementation, testing, and verification were done manually.

---

# Example Prompts Used

### Prompt 1

> Explain how to implement JWT Authentication in a MERN application with protected routes.

---

### Prompt 2

> How can I upload PDF, TXT, and Markdown files using Multer and store their extracted content in MongoDB?

---

### Prompt 3

> How can I integrate the Google Gemini API to answer questions based only on uploaded document content?

---

### Prompt 4

> Help me understand and fix MongoDB connection issues and improve API error handling.

---

# AI Generated vs Developer Work

## AI Assistance

AI helped with:

- Initial project planning
- Folder structure suggestions
- Basic API implementation examples
- React component ideas
- Error handling suggestions
- Documentation guidance

---

## Developer Work

The following work was completed manually:

- Project setup
- MongoDB Atlas configuration
- JWT configuration
- Environment variable setup
- Connecting frontend and backend
- API testing using Postman
- Debugging application errors
- Fixing MongoDB connection issues
- Fixing Gemini API integration
- Testing document uploads
- Testing authentication flow
- Improving UI and user experience
- Final code review and project verification

---

# Issues Found During Development

During development, AI suggestions did not always work correctly and required manual changes.

Some examples include:

### 1. MongoDB Connection

The initial database configuration failed because of an incorrect connection string and DNS resolution issue. After checking the Atlas configuration and updating the connection settings, the application connected successfully.

---

### 2. Gemini Model

The suggested Gemini model was not available for the generated API key. After testing different available models, the application was updated to use the supported model.

---

### 3. PDF Parsing

The initial PDF parsing implementation required changes because of differences in the installed package version. The parsing service was updated after verifying the package documentation.

---

# How the Project Was Tested

The project was tested manually after implementing each feature.

The following scenarios were verified:

### Authentication

- User Registration
- User Login
- Protected Routes
- Logout

---

### Document Upload

- Upload PDF
- Upload TXT
- Upload Markdown
- Invalid file upload

---

### AI Question Answering

- Upload document
- Ask questions related to the uploaded document
- Verify responses from Gemini
- Verify fallback response when information is unavailable

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

- Invalid login credentials
- Unauthorized requests
- Invalid file uploads
- Database connection failures
- Gemini API failures

---

# Verification

Before submission, the project was verified by:

- Running the frontend locally
- Running the backend locally
- Testing all REST APIs
- Uploading different document formats
- Verifying AI responses
- Checking MongoDB data
- Reviewing application flow from login to AI chat

---

# Conclusion

AI was used to improve development speed and to understand new concepts during the project. Every important feature was reviewed, tested, and verified manually before submission.

The final application reflects my understanding of the technologies used and the implementation decisions made throughout the development process.