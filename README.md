# 📱 WhatsApp Web Clone

A real-time chat application inspired by **WhatsApp Web** built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**.  
Supports **one-to-one messaging**, **message seen ticks**, **online/offline status**, and **chat history** – all in real time.

---

## 🚀 Features

- **Real-time Messaging**  
  Instant message delivery using **Socket.IO** with smooth UI updates.

- **Message Seen Ticks**  
  ✅ Single tick = Sent  
  ✅✅ Double tick = Delivered  
  ✅✅ (Blue) = Seen

- **Online/Offline Status**  
  Tracks and displays when users are online or offline.

- **Chat History**  
  Persistent chat storage using MongoDB.

- **Auto Scroll**  
  Opens chats at the latest message without forced scrolling.

---

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

