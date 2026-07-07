# AI-Powered Knowledge Base Assistant

## Project Overview

AI-Powered Knowledge Base Assistant is a Full Stack MERN application that allows users to upload documents and ask questions related to those documents using Google Gemini AI.

The application extracts the text from uploaded PDF, TXT, and Markdown files and uses that content as context while answering user questions. It also stores previous conversations, maintains document history, and provides a dashboard with useful statistics.

This project was built to demonstrate Full Stack Development skills including authentication, REST APIs, MongoDB, React, Express.js, and AI integration.

---

# Features

## User Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt
- Logout

---

## Document Management

- Upload PDF files
- Upload TXT files
- Upload Markdown files
- Extract document text
- Store document metadata
- View uploaded documents
- Preview extracted document content
- Delete documents

---

## AI Question Answering

- Ask questions about uploaded documents
- Google Gemini AI integration
- Answers generated only from uploaded document content
- Graceful fallback if the answer is not found

---

## Chat History

- Stores every question and answer
- Displays previous conversations
- Maintains timestamps
- Associates conversations with uploaded documents

---

## Dashboard

Displays

- Total Documents
- Total Questions Asked
- Recent Uploads
- Recent Conversations

---

## Search

- Search uploaded documents
- Search previous conversations

---

## Error Handling

- Invalid login credentials
- Unauthorized access
- Invalid file uploads
- Unsupported file types
- AI API failures
- Database connection errors

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs

## File Upload

- Multer

## AI

- Google Gemini API

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

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd AI-Powered-Knowledge-Base-Assistant
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

Example

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

POST `/signup`

POST `/login`

POST `/logout`

GET `/me`

---

## Documents

GET `/documents`

POST `/documents`

GET `/documents/:id`

DELETE `/documents/:id`

---

## AI

POST `/ask`

---

## Chat History

GET `/history`

---

## Dashboard

GET `/dashboard`

---

# Database Collections

## User

- Name
- Email
- Password
- Created At

---

## Document

- Title
- File Name
- File Type
- Owner
- Upload Time
- Metadata
- Extracted Content

---

## Conversation

- User
- Document
- Question
- Answer
- Timestamp

---

# Application Workflow

1. User registers an account.
2. User logs into the application.
3. User uploads a document.
4. Backend extracts the document text.
5. Extracted text is stored in MongoDB.
6. User asks a question.
7. Backend sends the document content and question to Google Gemini.
8. Gemini returns an answer.
9. The answer is displayed to the user.
10. Conversation history is saved for future reference.

---

# Environment Variables

Backend requires

```
PORT

MONGODB_URI

JWT_SECRET

GEMINI_API_KEY
```

---

# Future Improvements

- Multiple document upload
- OCR support for scanned PDFs
- Better search functionality
- Document sharing
- Role-based authentication
- AI response streaming
- Cloud file storage
- Pagination for large datasets

---

# Screenshots

- Login Page (./screenshots/Login.png)
- Dashboard (./screenshots/Dashboard.png)
- Document Upload (Upload.png)
- AI Chat(AI_Chat.png)
- Conversation History(Chat_History.png)

---

# Author

Vinay Tiramdasu

B.Tech - Electronics and Communication Engineering

Full Stack MERN Developer
