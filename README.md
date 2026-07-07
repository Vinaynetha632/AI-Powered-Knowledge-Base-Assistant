# AI-Powered Knowledge Base Assistant

A production-quality, beginner-friendly Full Stack MERN application that enables users to upload document files (PDF, TXT, MD), extracts their text contents, and allows users to ask questions. A strict Google Gemini system instruction enforces that the AI only answers using information within the uploaded file context.

---

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** (build tool and dev server)
- **Tailwind CSS v4** (pure CSS integration, utility styling)
- **React Router v7** (client-side routing)
- **Axios** (HTTP client with auto JWT interceptors)
- **Lucide React** (clean UI icons)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Database modeling)
- **jsonwebtoken** & **bcryptjs** (Authentication & security)
- **Multer** (File upload handling)
- **pdf-parse** (PDF text extraction)
- **@google/generative-ai** (Gemini AI integration)

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or an Atlas connection string

### 1. Clone the repository and navigate to the folder
```bash
cd "AI-Powered Knowledge Base Assistant"
```

### 2. Set up Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables) below).

### 3. Set up Frontend
```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a file named `.env` in the `backend/` directory and populate it with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/kb-assistant
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_from_google_studio_here
CLIENT_URL=http://localhost:5173
```

---

## How to Run

### Run Backend
In the `backend/` directory:
```bash
npm run dev
# Starts server using nodemon on port 5000
```
*(If your npm scripts do not have dev, you can run `npx nodemon server.js` or configure `npm start` with `node server.js`)*

### Run Frontend
In the `frontend/` directory:
```bash
npm run dev
# Starts Vite React application on port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Structure

### Backend Layout
```text
backend/
├── config/          # DB config
│   └── db.js
├── controllers/     # Route logic functions
│   ├── authController.js
│   ├── chatController.js
│   ├── dashboardController.js
│   └── documentController.js
├── middleware/      # Auth, uploads, and error interceptors
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
├── models/          # Mongoose schemas
│   ├── Conversation.js
│   ├── Document.js
│   └── User.js
├── routes/          # Express routing
│   └── api.js
├── services/        # Third party API wrappers
│   ├── geminiService.js
│   └── parserService.js
├── uploads/         # Temporary uploaded files
├── .env.example
├── package.json
└── server.js
```

### Frontend Layout
```text
frontend/
├── src/
│   ├── components/  # Reusable layouts and components
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── Modal.tsx
│   │   └── Layout/
│   │       └── AppLayout.tsx
│   ├── context/     # Auth and Toast notification providers
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── pages/       # Route page views
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── AIChat.tsx
│   │   ├── ConversationHistory.tsx
│   │   ├── DocumentPreview.tsx
│   │   ├── Documents.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── services/    # Axios API endpoints calls
│   │   └── api.ts
│   ├── types/       # TypeScript models
│   │   └── index.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## API Endpoints

All endpoints require JWT bearer tokens in the header (`Authorization: Bearer <token>`) unless marked as Public.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Public | Registers a new user, hashes password, returns user & JWT |
| **POST** | `/login` | Public | Validates user password, signs and returns JWT |
| **POST** | `/logout` | Public | Returns logout status message |
| **GET** | `/me` | Private | Returns details of the currently logged-in user |
| **GET** | `/documents` | Private | Returns a list of documents owned by the user (supports `?search=`) |
| **POST** | `/documents` | Private | Accepts multipart form upload, parses text, caches in DB |
| **GET** | `/documents/:id` | Private | Returns details and extracted text content for a single document |
| **DELETE**| `/documents/:id` | Private | Deletes document metadata, database record, and files on server disk |
| **POST** | `/ask` | Private | Submits a query on a document, calls Gemini, saves conversation |
| **GET** | `/history` | Private | Retrieves previous conversation history (supports `?search=`) |
| **GET** | `/dashboard` | Private | Returns aggregated document counts, questions, and recent items |

---

## Future Improvements

1. **Vector Embeddings (Vector Search)**: Integrate Pinecone or ChromaDB with Gemini Embeddings to enable Semantic Chunk Search, allowing chat capabilities on massive documents exceeding context windows.
2. **Multiple Files upload**: Extend upload inputs to drag/drop multiple files concurrently.
3. **Session Refresh Token**: Implement JWT refresh tokens in HTTP-only cookies to secure sessions against local storage script injection.
4. **OCR Parsing**: Integrate Tesseract OCR or Google Cloud Vision to extract text from scanned PDFs or images.
