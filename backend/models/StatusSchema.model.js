const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
  },
  statusUrl: {
    type: String,
    required: true,
  },
  publidUrlOfstatus: {
    type: String,
    required: true,
  },
  views: [
    {
      viewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
  },
}, { timestamps: true });

// statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete after expiry

module.exports = mongoose.model("Status", statusSchema);
