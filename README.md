Live Link: 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Overview:

Bookify is a modern full-stack web application for uploading, parsing, and managing books. It integrates MongoDB for data storage, supports PDF processing, and uses Vercel Blob for file uploads.
The system allows users to upload books, extract content, and manage structured data efficiently.

✨ Features
📄 Upload PDF files with metadata
🧠 Automatic PDF parsing and segmentation
☁️ File storage using Vercel Blob
🔐 Authentication with Clerk
📦 MongoDB database integration
⚡ Server Actions & API Routes
✅ Form validation with Zod
🔔 Toast notifications (Sonner)
🎨 Clean UI with modern components
🏗️ Tech Stack
Frontend: Next.js, React, Tailwind CSS
Backend: Next.js Server Actions, API Routes
Database: MongoDB, Mongoose
Auth: Clerk
Storage: Vercel Blob
Validation: Zod
PDF Processing: pdfjs-dist
