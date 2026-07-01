# BIOBOT 2.0

BIOBOT 2.0 is an intelligent academic assistant web application developed for the Department of Biotechnology Engineering at ORT Braude College.

The system provides students with personalized academic information, institutional regulations, forms management, and an AI-powered chatbot capable of answering academic questions using Retrieval-Augmented Generation (RAG) techniques.

---

## Project Overview

BIOBOT was developed as part of the Web Development course project.

The main goal of the system is to provide students with a centralized platform that combines:

* Personal academic information
* Academic regulations and procedures
* Institutional forms
* Smart AI assistance
* Administrative management tools

---

## Main Features

### Student Features

* User registration and login using JWT authentication
* Personal profile page
* Academic status calculation
* GPA calculation
* Credits tracking
* Completed courses visualization
* Academic schedule viewing
* Smart academic chatbot
* Forms browsing and downloading
* Dark/Light mode support
* Chat history management

### Administrator Features

* User management
* Role management (student/admin)
* Forms management
* Uploading PDF and Word documents
* Editing and deleting forms
* System administration dashboard

---

## BIOBOT AI Assistant

BIOBOT includes an AI-powered academic assistant based on Google's Gemini API.

The chatbot combines:

* Student personal information
* Academic regulations
* Department information
* Institutional forms
* Administrative procedures

The system uses a custom Retrieval-Augmented Generation (RAG) architecture that includes:

* Text chunking
* Embedding generation
* Vector retrieval
* Semantic similarity search
* Personalized academic reasoning

Examples of supported questions:

* "What is my academic status?"
* "How many credits do I have?"
* "What courses are left for my degree?"
* "How can I appeal an exam grade?"
* "Which form should I submit?"

---

## Technologies

### Frontend

* React
* React Router
* Tailwind CSS
* React Hooks
* JWT Authentication

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcrypt

### Artificial Intelligence

* Google Gemini API
* Gemini Embeddings API
* Retrieval-Augmented Generation (RAG)

---

## Project Architecture

```
Frontend (React + Tailwind)
            |
            v
Backend API (Express)
            |
            +----------------+
            |                |
            v                v
MongoDB Atlas        Gemini API
            |
            v
RAG Engine
  ├── chunker
  ├── embedder
  ├── vectorStore
  └── retriever
```

---

## Project Structure

```
client/
│
├── pages/
├── components/
├── services/
├── assets/
└── GUIManagement/

server/
│
├── routes/
├── models/
├── middleware/
├── utils/
├── rag/
│   ├── chunker.js
│   ├── embedder.js
│   ├── vectorStore.js
│   └── retriever.js
├── data/
└── scripts/
```

---

## Installation

### Clone repository

```bash
git clone <repository-url>
cd BIOBOT
```

### Install frontend

```bash
cd client
npm install
```

### Install backend

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file inside the client directory:

```env
VITE_API_URL=http://localhost:3000
```

---

## Running the Project

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* AI Services: Google Gemini API

---

## Team Members

* Shahd Abu Sayah
* Ahmad Shhade
* Emad Taha
* Essa Shibli
* Mohammad Dahabre

---

## Academic Project

This project was developed as part of the Software Engineering program at ORT Braude College of Engineering.
