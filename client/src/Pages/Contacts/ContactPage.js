import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Component/AuthContext";
import { IoPersonCircle } from "react-icons/io5";
import { io } from "socket.io-client";
import { IoImages } from "react-icons/io5";
import { MdMissedVideoCall } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import "./ContactPage.css";
import Loading from "../Loader/Loader";

const ContactPage = () => {
  const { currentUser, logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  
    setSocket(newSocket);
  
  
    newSocket.emit("fetchContacts", currentUser?.id || currentUser?._id);
  
    newSocket.on("contacts", (data) => {
      setContacts(data);
   
      setLoading(false);
    });
    newSocket.on("newConversation", (newContact) => {
      setContacts((prevContacts) => {
        if (!prevContacts.some(contact => contact._id === newContact._id)) {
          return [...prevContacts, newContact];
        }
        return prevContacts;
      });
    });
  
    newSocket.on("updateLastMessage", (updatedContact) => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === updatedContact.userId
            ? { ...contact, lastMessage: updatedContact.lastMessage, lastMessageTime: updatedContact.lastMessageTime }
            : contact
        )
      );
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);
  

  if (loading) return <div className="Load-align" ><Loading/></div>;

  const handleUserClick = (userId) => {
    navigate(`/conversation/${userId}`);
  };

  return (
    <div className="Main-contactPage">
      <div className="Profile-Arrangement">
        <div className="My-Account-alignment">
          <div className="picture-alignment">
            {currentUser?.profile_pic ? (
              <img
                className="image-align"
                src={currentUser.profile_pic}
                alt="profilepic"
              />
            ) : (
              <IoPersonCircle size={50} className="image-align" />
            )}
          </div>
          <div className="profile-account">
            <h5>{currentUser?.name}</h5>
            <p>My profile</p>
          </div>
        </div>
        <div className="Logout-align">
          <button onClick={logout} title="Logout">
            <BiLogOut size={25} />
          </button>
        </div>
      </div>
      <div className="Messages-alignment">
        <h5 className="message-head">Messages</h5>
        <div className="Message-container scrollbar">
          {contacts.length > 0 ? (
            contacts.map((user) => (
              <div
                key={user._id}
                className="message-box"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="contact-item">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="rounded-image"
                    />
                  ) : (
                    <IoPersonCircle size={45} className="rounded-image" />
                  )}
                </div>
                <div className="contact-info">
                  <h3>{user.name}</h3>

                  <p>
                    {user?.lastMessage ? (
                      <>
                        {user.lastMessage.text && <span>{user.lastMessage.text}</span>}
                        {user.lastMessage.imageUrl && (
                          <IoImages title="Image attached" />
                        )}
                        {user.lastMessage.videoUrl && (
                          <MdMissedVideoCall title="Video attached" />
                        )}
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>No conversations yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
