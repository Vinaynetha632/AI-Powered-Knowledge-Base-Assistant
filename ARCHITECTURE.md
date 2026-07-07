# Architecture

## Project Overview

The AI-Powered Knowledge Base Assistant is a Full Stack MERN application that allows users to upload documents and ask questions related to those documents using Google Gemini AI.

The application follows a client-server architecture where the frontend communicates with the backend using REST APIs. The backend handles authentication, document processing, database operations, and AI communication.

---

# Project Structure

```
AI-Powered-Knowledge-Base-Assistant

│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│
├── README.md
├── AI_USAGE.md
├── ARCHITECTURE.md
└── DEBUG_NOTES.md
```

---

# Application Architecture

```
                React Frontend
                      │
                      │ REST API (Axios)
                      ▼
              Express.js Backend
                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼
 MongoDB         Google Gemini      File Upload
                API Integration       (Multer)
```

---

# Frontend Architecture

The frontend is developed using React with TypeScript.

It is responsible for

- User Authentication
- Dashboard
- Document Upload
- AI Chat
- Conversation History
- Document Search
- Dashboard Statistics

The frontend communicates with the backend through Axios API calls.

JWT tokens are stored after login and automatically sent with every protected request.

---

# Backend Architecture

The backend is developed using Node.js and Express.js.

Its responsibilities include

- User Authentication
- JWT Verification
- File Upload
- Document Parsing
- Database Operations
- Google Gemini Integration
- Chat History
- Dashboard Data

The backend exposes REST APIs that are consumed by the React frontend.

---

# Folder Responsibilities

## controllers

Contains the business logic for every API.

Example

- Authentication
- Documents
- Chat
- Dashboard

---

## routes

Defines all API endpoints.

Example

```
POST /signup

POST /login

POST /documents

POST /ask

GET /history
```

---

## models

Contains MongoDB schemas.

- User
- Document
- Conversation

---

## middleware

Contains reusable middleware.

Examples

- JWT Authentication
- File Upload
- Error Handling

---

## services

Contains reusable services.

Examples

- Gemini API
- Document Parser

---

## utils

Contains helper functions used across the project.

---

# Database Design

Three collections are used.

## User

Stores

- Name
- Email
- Password
- Created Date

---

## Document

Stores

- Document Name
- File Type
- Owner
- Upload Time
- Metadata
- Extracted Text

The extracted document text is stored so that it can be reused while asking questions.

---

## Conversation

Stores

- User
- Document
- Question
- AI Response
- Timestamp

This allows users to view previous conversations.

---

# Authentication Flow

1. User registers an account.
2. Password is encrypted using bcrypt.
3. User logs in.
4. Backend verifies email and password.
5. JWT token is generated.
6. Token is returned to the frontend.
7. Frontend sends the token with protected API requests.
8. Backend verifies the token before processing the request.

---

# Document Upload Flow

1. User selects a document.

2. The file is uploaded using Multer.

3. Backend validates the file type.

4. Text is extracted from the uploaded document.

5. Extracted text is stored in MongoDB.

6. Document information is saved.

---

# AI Question Answering Flow

1. User selects a document.

2. User enters a question.

3. Backend retrieves the extracted document text.

4. Backend sends both

- Document Content
- User Question

to Google Gemini.

5. Gemini generates an answer based only on the uploaded document.

6. Backend stores the conversation.

7. The response is sent back to the frontend.

---

# Dashboard Flow

The dashboard collects information from MongoDB and displays

- Total Documents
- Total Questions
- Recent Uploads
- Recent Conversations

---

# Error Handling

The application handles different error scenarios.

Examples

- Invalid Login
- Unauthorized Access
- Invalid File Upload
- Unsupported File Type
- Missing Document
- Database Errors
- Gemini API Errors

Meaningful error messages are returned to the frontend.

---

# Security

The application follows basic security practices.

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected APIs require valid tokens.
- Environment variables are stored in a .env file.
- Sensitive information is not hardcoded.
- File types are validated before upload.

---

# Why These Technologies?

### React

Used to build a responsive and reusable user interface.

### Express.js

Used to create REST APIs and manage backend logic.

### MongoDB

Stores user information, uploaded documents, and conversation history.

### JWT

Provides secure authentication for protected APIs.

### Multer

Handles document uploads.

### Google Gemini

Answers user questions using uploaded document content.

---

# Future Improvements

If this project is extended in the future, the following improvements can be added.

- Multiple document upload
- OCR support for scanned PDFs
- Pagination
- Role Based Access Control
- Cloud Storage (AWS S3)
- Better search functionality
- AI response streaming
- Docker deployment
- Unit testing
- Email verification

---

# Conclusion

This project follows a simple and modular architecture where each part of the application has a specific responsibility.

The frontend handles the user interface, the backend manages the business logic, MongoDB stores the application data, and Google Gemini provides AI-powered document question answering.

The architecture is easy to understand, maintain, and extend with additional features in the future.