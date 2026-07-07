# Debugging & Troubleshooting Notes

This document captures four realistic debugging scenarios encountered during the development of the AI-Powered Knowledge Base Assistant. Each entry covers the symptom, root cause, investigation, and solution.

---

## Issue 1: Server Crashes on Document Upload When `uploads/` Folder is Missing

### Problem
When attempting to upload a PDF or text file for the first time, the request fails with a `500 Internal Server Error`, and the Express terminal logs:
`Error: ENOENT: no such file or directory, open 'D:\My Projects\AI-Powered Knowledge Base Assistant\backend\uploads\...'`

### Root Cause
By default, the `multer.diskStorage` configuration was pointing to a folder path (`backend/uploads`) that did not exist on the file system. Multer does not automatically create parent directories for disk storage, leading to an immediate I/O failure when writing files.

### Investigation
1. Inspected the Multer configuration in `backend/middleware/upload.js`.
2. Noticed that the destination path was hardcoded to `path.join(__dirname, '../uploads')`.
3. Verified the workspace and noticed that the `uploads/` directory had not been created yet (or was excluded from git).

### Solution
Modified `backend/middleware/upload.js` to dynamically inspect the filesystem using Node's standard `fs.existsSync` inside the storage `destination` handler, and run `fs.mkdirSync` recursively if missing:

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure upload directory exists before writing file
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  }
});
```

---

## Issue 2: Scanned PDFs Return Empty Extracted Content Without Error

### Problem
A user uploads a PDF document successfully. However, when asking questions about it, the AI assistant constantly responds with:
`"I couldn't find this information in the uploaded document."`
Upon opening the Document Preview, the extracted text viewer is completely empty.

### Root Cause
The PDF uploaded is a **scanned image** (e.g., a photo of a document converted to PDF). The `pdf-parse` library reads digital text layers and metadata. It does not perform Optical Character Recognition (OCR). Therefore, it parses 0 characters without raising a code error.

### Investigation
1. Logged the parsed text in `backend/services/parserService.js` and saw `parsedText.text === ""`.
2. Verified that the PDF opened and read fine in Chrome but text could not be highlighted (confirming it is an image PDF).

### Solution
Added a validation check in the backend parser service. If the parsed PDF returns empty text content, it throws a user-friendly error to reject the document, asking the user to upload a digitally typed PDF or text document:

```javascript
const data = await pdfParse(fileBuffer);
if (!data || !data.text || data.text.trim() === '') {
  throw new Error('Could not extract text from the PDF file. It may be a scanned image PDF. Please upload a digital text document.');
}
```

---

## Issue 3: Gemini API Call Fails with "Invalid Key" or Quota Block, Crashing the Server

### Problem
When the user submits a question on the AI Chat screen, the typing indicator pulses indefinitely, and the server log reports:
`TypeError: Cannot read properties of undefined (reading 'generateContent')` or similar, followed by a server crash.

### Root Cause
If `process.env.GEMINI_API_KEY` was missing, empty, or misspelled in the backend `.env` file, the SDK initialization succeeded but content generation calls threw uncaught exceptions. If not wrapped in proper try-catch handlers, these exceptions bubble up and crash the Node process.

### Investigation
1. Inspected `backend/services/geminiService.js`.
2. Verified that the `GoogleGenerativeAI` instance was initialized directly without verifying if the API key variable was loaded.
3. Observed that the service did not catch external API errors, leading to uncaught promise rejections.

### Solution
1. Added validation at the entry of the service to throw a clean error if the API key is not configured.
2. Wrapped the entire generation block in a robust try-catch wrapper to return a clean error instead of letting the process crash.
3. Handled the error inside `chatController.js` and passed it to the global error middleware:

```javascript
const askGemini = async (documentContent, question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment configuration.');
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    // ...
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Gemini API communication failed. Please check your credentials and quota limits.');
  }
};
```

---

## Issue 4: Infinite Loader Screen in React App After JWT Token Expires

### Problem
A user logs in, closes their browser, and returns the next day. The application shows an infinite spinning loader icon and fails to display the dashboard or redirect to login.

### Root Cause
The JWT token stored in the browser's `localStorage` expired (validity was reached). On mount, `AuthContext` retrieved the token and attempted to fetch `/me`. The server returned a `401 Unauthorized` response with a token expired message, but the React auth loading state was never set to false, locking the UI in a loading state.

### Investigation
1. Inspected `frontend/src/context/AuthContext.tsx`.
2. Found that the `initializeAuth` method called `authService.getMe()`, but when the API call failed, the catch block logged the error but did not trigger `setLoading(false)`.

### Solution
Updated the `catch` block in `initializeAuth` to clear expired credentials from `localStorage`, set the global `user` to `null`, and always set `loading` to `false` in the `finally` block:

```javascript
useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        const data = await authService.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false); // Guarantees that loading completes, avoiding infinite spins
  };

  initializeAuth();
}, []);
```

---

## Issue 5: Mongoose querySrv ECONNREFUSED DNS Resolution Failures on Windows/ISPs

### Problem
When starting the server on local Windows environments, database connection attempts to MongoDB Atlas clusters fail with:
`MongoDB Connection Error: querySrv ECONNREFUSED _mongodb._tcp.assignment.oqrn0d1.mongodb.net`

### Root Cause
This error occurs when the default DNS server configured on the developer's computer (provided by their Internet Service Provider) does not support DNS SRV records or times out during resolution of `_mongodb._tcp` Atlas endpoints.

### Investigation
1. Confirmed that the cluster connection URL was typed correctly and Atlas cluster firewall allows connections from any IP.
2. Verified that standard DNS A-record queries (like pinging websites) work, but custom SRV queries fail.

### Solution
Overrode the default DNS resolution configuration inside Node.js by setting the process to use Google's Public DNS servers (`8.8.8.8` and `8.8.4.4`) at the very top of `backend/server.js` before initializing Mongoose:

```javascript
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
```
This forces all SRV record queries inside the Node runtime to resolve through Google DNS, completely bypassing local router DNS blocks.

---

## Issue 6: `TypeError: pdfParse is not a function` on Document Upload

### Problem
During document uploads, the request fails with a `500 Internal Server Error` and the server logs:
`TypeError: pdfParse is not a function` at `parseDocument` inside `backend/services/parserService.js`.

### Root Cause
The legacy version of `pdf-parse` (v1.1.1) exported the parser function directly as the root module export. However, newer versions (e.g. v2.x.x) export a class named `PDFParse` as a property of the main module object. Attempting to execute `pdfParse(buffer)` directly triggers a type exception.

### Investigation
1. Ran `node -e "console.log(require('pdf-parse'))"` in the terminal.
2. Discovered that the imported package returned an object: `{ PDFParse: [class (anonymous)], Table: ..., Shape: ... }`.
3. Verified the prototype of the `PDFParse` class and identified the `getText` asynchronous instance method.

### Solution
Updated the implementation in `backend/services/parserService.js` to instantiate the `PDFParse` class using `new pdf.PDFParse({ data: fileBuffer })` and execute `.getText()` on the resulting parser instance:

```javascript
const pdf = require('pdf-parse');

const parser = new pdf.PDFParse({ data: fileBuffer });
const data = await parser.getText();
const text = data.text; // Extracted text string
const pageCount = data.total; // Page count metadata
```

---

## Issue 7: `[404 Not Found] models/gemini-1.5-flash is not found for API version v1beta` on AI Questioning

### Problem
When submitting a query in the chat feed, the server logs a `500 API Error`:
`Error: Gemini API error: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404 Not Found] models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent.`

### Root Cause
Certain Google Cloud project API keys or specific region endpoints restrict content generation lookups to newer model generations (like `gemini-2.5-flash`) and throw 404 when querying legacy names (like `gemini-1.5-flash`) on the `v1beta` endpoint structure.

### Investigation
1. Created a diagnostic script `test_gemini.js` to sequentially test `gemini-1.5-flash`, `gemini-2.5-flash`, and `gemini-1.5-pro` with the active API key.
2. Executed the script and observed that `gemini-1.5-flash` failed with 404, while `gemini-2.5-flash` succeeded immediately and returned a valid response.

### Solution
Modified `backend/services/geminiService.js` to query the newer model identifier:

```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```
