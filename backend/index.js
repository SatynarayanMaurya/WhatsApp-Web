const express = require("express");
const route = require("./routes/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const database = require("./config/database");

// Server and Socket
const http = require("http");
const { Server } = require("socket.io");
const { sendMessage, seenMessages } = require("./controllers/message.controller");
const { markAsOffline, markAsOnline } = require("./controllers/user.controller");

const app = express();
const server = http.createServer(app);

// Connect to DB
database.db();

// Middlewares
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // Your frontend
    credentials: true,
}));
app.use(express.json());
app.use(route);

// Sample route
app.get("/", (req, res) => {
    res.send(`<h1>Hello from WhatsApp</h1>`);
});

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// Socket.io logic
io.on("connection", (socket) => {
    // console.log("✅ A user connected:", socket.id);

    socket.on("join", async(userId) => {
        socket.userId = userId
        await markAsOnline(userId)
        socket.join(userId);
        socket.broadcast.emit("userOnline", { userId: userId });
        // console.log(`User ${userId} joined their personal room`);
    });

    socket.on("sendMessage", async(data) => {
        try{
            await sendMessage(data)
            io.to(data.receiver).emit("receiveMessage", {
                chatId:data.chatId,
                sender:data.sender,
                receiver:data.receiver,
                message:data.message,
                type:data.type,
                timestamp: new Date(),
            });
        }
        catch(error){
            console.log("error in sending the message or saving to db")
        }

    });
    
    socket.on("seenMessages", async (data) => {
        try {
            const updatedMessage = await seenMessages(data); // mark in DB

            io.to(data.sender ).emit("messagesSeen", {
                updatedMessage,
                chatId: data.chatId,
                seenBy: data.sender, 
                timestamp: Date.now(),
            });
            io.to(data.receiver ).emit("messagesSeen", {
                updatedMessage,
                chatId: data.chatId,
                seenBy: data.sender, 
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error("Error marking messages as seen", error);
        }
    });


    socket.on("disconnect", async() => {
        await markAsOffline(socket?.userId)
        console.log("❌ A user disconnected:", socket.userId);
        if (socket.userId) {
            socket.broadcast.emit("userOffline", { userId: socket.userId });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
