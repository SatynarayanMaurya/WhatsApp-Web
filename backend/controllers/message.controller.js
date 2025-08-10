const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

// Send Message Controller
exports.getOrCreateChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if(!senderId || !receiverId){
      return res.status(400).json({
        success:false,
        message:"Sender Id or Receiver Id not found"
      })
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        createdBy: senderId,
      });
    }

    res.status(200).json({ chatId: chat._id, chat });
  } catch (error) {
    res.status(500).json({ message: "Error getting or creating chat", error });
  }
};

exports.sendMessage = async ( data) => {
  try {
    const {sender, receiver, message, type = "text" } = data;
    if (!sender || !receiver || !message) {
      throw new Error("Missing required fields");
    }

    // Find or create a chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [sender, receiver], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [sender, receiver],
        isGroupChat: false,
        createdBy: sender,
      });
    }

    // Create message
    const newMessage = await Message.create({
      sender: sender,
      receiver: receiver,
      message,
      type,
      chatId: chat._id,
    });

    // Update latestMessage in chat
    chat.latestMessage = newMessage._id;
    await chat.save();

    return newMessage;
  } catch (error) {
    console.error("sendMessage error:", error.message);
    throw error;
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.query;

    if (!chatId) {
      return res.status(400).json({ success: false, message: "Chat ID is required" });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 }) // oldest to newest

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ success: false, message: error?.message ||"Failed to fetch messages" });
  }
};


exports.getAllChatId = async(req,res)=>{
  try{
    const allChatId = await Chat.find()
    return res.status(200).json({
      success:true,
      message:"All Chat Id fetched : ",
      allChatId
    })
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:error.message || "Error in getting all the Chat Id"
    })
  }
}


exports.seenMessages = async(data)=>{
  try{
    const {chatId} = data;
    if(!chatId){
      return res.status(400).json({
        success:false,
        message:"Chat Id not found"
      })
    }
    await Message.updateMany(
      { chatId }, 
      { $set: { seen: true } } 
    );

    const updatedMessages = await Message.find({ chatId });

    return updatedMessages;
  }
  catch(error){
    console.log("Error in updating the seen Messages : ",error)
  }
}

