# 📱 WhatsApp Web Clone

A real-time chat application inspired by **WhatsApp Web**, built with React, Node.js, Socket.IO, and MongoDB. Features include **one-to-one messaging**, **AI-powered chatbot** integration, message seen indicators, **online/offline** presence tracking, **chat history**, and real-time status updates

---

## 🚀 Features

- **Real-Time Messaging**  
  Seamless one-to-one messaging using **Socket.IO**, replicating WhatsApp-like instant delivery and smooth UI updates.

- **AI Chatbot Integration**  
  Built-in chatbot powered by **Google Gemini**, providing intelligent, conversational responses similar to Meta AI in WhatsApp.

- **Message Seen Ticks**  
  ✅ Single tick = Sent  
  ✅✅ Double tick = Delivered  
  ✅✅ (Blue) = Seen

- **Online/Offline Status**  
  Instantly detects and displays user availability in real time.

- **Real-Time Status Updates**  
  Share and view statuses instantly with live view count updates, showing how many users have seen the status without reloading.

- **Chat History**  
  Persistent and searchable chat storage using MongoDB.

- **Auto Scroll to Latest Message**  
  Automatically opens chats at the most recent message for a smooth conversation flow.

- **Secure Authentication**  
  User login and session management with JWT-based security.


## 🛠️ Tech Stack

**Frontend**:
- React
- Redux Toolkit (state management)
- Socket.IO Client
- Tailwind CSS

**Backend**:
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository
```bash
https://github.com/SatynarayanMaurya/WhatsApp-Web.git
cd WhatsApp-Web
```

### 2️⃣ Install dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd frontend
npm install
```
### 3️⃣ Set environment variables
```bash
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV = "production"
```
### 4️⃣ Run the app
#### Backend
```bash
cd backend
npm start
```
#### Frontend
```bash
cd frontend
npm run dev
```
## 📡 API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/login`          | User login               |
| GET    | `/get-all-users`  | Get all users            |
| GET    |`/get-chat-history`| Get Chat history         |
| GET    |`/get-user-details`| Get User Details         |

## 🚧 Future Improvements
- ✅ Group chats
- ✅ Emoji picker
- 📌 File/image sharing
- 📌 Typing indicator
- 📌 Read receipts per user in group chats

