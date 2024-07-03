const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model('conversations', ConversationSchema);

module.exports = ConversationModel;
