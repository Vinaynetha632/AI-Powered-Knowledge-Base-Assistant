# AI Usage & Development Summary

This document explains the integration of Artificial Intelligence within the Knowledge Base Assistant application, covering the tools used, prompt engineering, developer modifications, issues corrected, and verification protocols.

---

## 🛠️ AI Tools Used
During the development of this project, the primary AI tool used was **Antigravity** (designed by Google DeepMind). Additionally, the application integrates the official **Google Gemini API** (using the `@google/generative-ai` SDK) to perform document question answering.

---

## 🤖 How AI Was Used in Development

AI was utilized across the lifecycle of the project for:
1. **Architectural Scaffolding**: Mapping the MERN directory structures (`controllers`, `models`, `routes`, `middleware`, `services`, `context`, etc.).
2. **Boilerplate and Page Generation**: Generating React forms, TypeScript interfaces, global contexts, and Express controllers without placeholders.
3. **Refactoring and Optimization**: Adding type safety, refactoring imports for verbatim TS module syntax, and cleaning up console logs.
4. **Issue Investigation**: Diagnosing database DNS SRV errors and dependencies export differences.

---

## 📝 Example Prompts Used

Here are example prompts used during the development of this project:

### Prompt 1: Scaffolding files
> *"Generate a Node/Express backend folder structure with controllers, models, and middleware. Write the database configuration file using Mongoose to connect to MongoDB, ensuring errors are logged gracefully."*

### Prompt 2: Context containment prompt (For Gemini API Service)
> *"Create a prompt template to send to the Gemini API. Pass the extracted document text as context and the user's question. Instruct the model to answer ONLY from the text. If the answer is not supported, it must return exactly: 'I couldn't find this information in the uploaded document.' and nothing else."*

---

## ⚙️ What AI Generated vs. What Developer Modified

* **AI Generated**:
  * Express routing logic and model structures for `User`, `Document`, and `Conversation`.
  * The React client shell, including the authentication context (`AuthContext`), toast notification context (`ToastContext`), and private routes guard.
  * Responsive page layouts built on Tailwind CSS (collapsible sidebars, grid cards).
* **Developer Modified**:
  * **Absolute Env Loader**: Modified `dotenv` initialization to load `.env` using absolute pathing (`path.join(__dirname, '.env')`) to resolve terminal runtime directory bugs.
  * **DNS Overrides**: Injected programmatic DNS server overrides (`dns.setServers(['8.8.8.8'])`) directly at the server entry point to bypass local ISP DNS query failures (resolving `querySrv ECONNREFUSED`).
  * **Verbatim TS module imports**: Refactored frontend imports to use `import type` rather than default imports for interfaces, satisfying strict compiler rules (`verbatimModuleSyntax`).
  * **Safety cleanup**: Stripped out debug console logs that printed the loaded database URI, preventing sensitive passwords from leaking to console buffers.

---

## ⚠️ Where the AI Was Incorrect (And How It Was Fixed)

During development, the AI made two main assumptions that led to runtime bugs:

1. **Incorrect assumption on `pdf-parse` export structure**:
   * *AI Assumption*: The AI assumed `require('pdf-parse')` returns a direct function `pdfParse(buffer)` (conforming to legacy v1.x versions).
   * *Actual Behavior*: The installed package (`pdf-parse` v2.4.5) exports a wrapper object containing a `PDFParse` class: `{ PDFParse: [class] }`. Running it as a function threw `pdfParse is not a function`.
   * *Correction*: The developer inspected the package's prototype exports and refactored the service to use `new pdf.PDFParse({ data: buffer })` followed by calling `.getText()`.

2. **Model availability 404 (Gemini 1.5 Flash)**:
   * *AI Assumption*: The AI assumed the `gemini-1.5-flash` model identifier was universally available for all API key generations under standard SDK routes.
   * *Actual Behavior*: The user's specific API key was restricted on the `v1beta` endpoint, throwing a `404 Not Found` error when requesting `models/gemini-1.5-flash`.
   * *Correction*: The developer wrote a diagnostic test script to query different model endpoints, identified that `gemini-2.5-flash` was fully authorized for this API key, and updated the service to reference `gemini-2.5-flash`.

---

## 🔬 How Correctness Was Verified

1. **Static Analysis**: Compiled the React TypeScript code (`tsc -b && vite build`) to ensure zero typing errors or unused imports.
2. **DNS Diagnostic Tests**: Logged DNS resolutions locally to verify that the Mongoose driver resolved the cluster shards through Google's DNS.
3. **Boundary Testing**: Submitted questions to the Gemini API containing queries *unrelated* to the document contents to confirm that it correctly returned the fallback text: `"I couldn't find this information in the uploaded document."`
4. **Validation Filters**: Tried uploading a `.png` file to check if Multer's file filter correctly blocked the upload with a `400 Bad Request` and triggered a red error toast.
