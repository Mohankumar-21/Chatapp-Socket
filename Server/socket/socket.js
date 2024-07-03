const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
const User = require("../Schema/User");
const Message = require("../Schema/Message");
const Conversation = require("../Schema/Conversation");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});



let onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  User.find().then((users) => socket.emit("users", users));

  socket.on("userLoggedIn", (userId) => {
    onlineUsers.add(userId);

    io.emit("userStatus", { userId, status: "online" });
  });

  socket.on("fetchContacts", async (userId) => {
    try {
      const conversations = await Conversation.find({
        participants: userId,
      });

      const participantIds = [
        ...new Set(
          conversations.flatMap((conversation) =>
            conversation.participants.filter((id) => id !== userId)
          )
        ),
      ];

      const contacts = await User.find({ _id: { $in: participantIds } });

      const filteredContacts = [];

      for (const contact of contacts) {
        const conversation = conversations.find((convo) =>
          convo.participants.includes(contact._id)
        );

        if (conversation) {
          const lastMessage = await Message.findOne({
            conversationId: conversation._id,
          }).sort({ timestamp: -1 });

          filteredContacts.push({
            ...contact.toObject(),
            lastMessage: lastMessage
              ? {
                  text: lastMessage.text,
                  timestamp: lastMessage.timestamp,
                  imageUrl: lastMessage.imageUrl,
                  videoUrl: lastMessage.videoUrl,
                }
              : null,
          });
        }
      }

     
      const contactsWithConversations = filteredContacts.filter(
        (contact) => contact.lastMessage !== null
      );

      socket.emit("contacts", contactsWithConversations);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      socket.emit("contacts", []);
    }
  });

  socket.on("joinRoom", async ({ userId, otherUserId }) => {
    const roomName = [userId, otherUserId].sort().join("-");
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
      type: "private",
    });

    if (conversation) {
      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort({ timestamp: 1 });
      socket.emit("previousMessages", messages);
    } else {
      conversation = new Conversation({
        participants: [userId, otherUserId],
        type: "private",
      });
      await conversation.save();
    }

    socket.emit("conversation", conversation);
  });

  const notifyNewConversation = async (senderId, receiverId) => {
    try {
      const users = await User.find({ _id: { $in: [senderId, receiverId] } });
      const [sender, receiver] = users;
  
      if (sender) {
        io.to(sender._id.toString()).emit("newConversation", receiver);
      }
  
      if (receiver) {
        io.to(receiver._id.toString()).emit("newConversation", sender);
      }
    } catch (err) {
      console.error("Error notifying about new conversation:", err);
    }
  };
  

  socket.on("sendMessage", async (messageData) => {
    console.log("Received messageData:", messageData);
    const { senderId, receiverId, text, timestamp, conversationId, videoUrl, imageUrl } = messageData;
  
    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId");
      return;
    }
  
    let conversation = await Conversation.findById(conversationId);
  
    if (!conversation) {
      const participants = [senderId, receiverId];
      conversation = new Conversation({ participants, type: "private" });
      await conversation.save();
    }
  
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      text,
      timestamp,
      videoUrl,
      imageUrl,
    });
  
    await newMessage.save();
  
    conversation.lastMessage = text;
    conversation.lastMessageTime = timestamp;
    await conversation.save();
  
    const roomName = [senderId, receiverId].sort().join("-");
    io.to(roomName).emit("receiveMessage", newMessage);
  
    const contactsUpdate = {
      userId: receiverId,
      lastMessage: newMessage.text,
      lastMessageTime: newMessage.timestamp,
      imageUrl: newMessage.imageUrl,
      videoUrl: newMessage.videoUrl,
    };
  
    io.to(senderId).emit("updateLastMessage", contactsUpdate);
    io.to(receiverId).emit("updateLastMessage", contactsUpdate);
  
    if (!conversationId) {
      notifyNewConversation(senderId, receiverId);
    }
  });
  
  

  socket.on("userLoggedOut", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
    

      io.emit("userStatus", { userId, status: "offline" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

module.exports = { app, server };
