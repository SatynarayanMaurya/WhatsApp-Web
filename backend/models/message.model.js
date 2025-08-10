const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Group' if you have group chats
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    default: 'text',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // assuming you have a Chat model
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);
