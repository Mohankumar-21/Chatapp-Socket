
const Conversation = require('../Schema/Conversation');

  

  const fetchPartnerDetailsFromDatabase = async (conversationId) => {
    try {
  
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return null; 
      }
      return {
        name: conversation.partnerName,
        profile_pic: conversation.partnerProfilePic,
        online: conversation.partnerOnlineStatus,
      };
    } catch (error) {
      console.error("Error fetching partner details from database:", error);
      throw error; 
    }
  };





  module.exports = fetchPartnerDetailsFromDatabase;