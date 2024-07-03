import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../Component/AuthContext";
import { IoPersonCircle } from "react-icons/io5";
import { BiPlusCircle } from "react-icons/bi";
import { MdVideoLibrary } from "react-icons/md";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IoIosImages } from "react-icons/io";
import UploadFile from "../../Cloudinary/Cloudinary";
import { io } from "socket.io-client";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import "./ConversationPage.css";
import Loading from "../Loader/Loader";

const ConversationPage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const messageContainerRef = useRef(null);
  const [openimgvid, setOpenimgvid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [userStatus, setUserStatus] = useState("offline");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/route/${userId}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    setSocket(newSocket);
    if (currentUser && (currentUser.id || currentUser?.id)) {
      newSocket.emit("userLoggedIn", currentUser.id);
    }
    newSocket.emit("joinRoom", {
      userId: currentUser?.id || currentUser?._id,
      otherUserId: userId,
    });

    newSocket.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("conversation", (conversation) => {
      setConversation(conversation);
    });

    newSocket.on("userStatus", ({ userId, status }) => {
      setUserStatus(status);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, currentUser]);

  useEffect(() => {
    return () => {
      if (socket && currentUser) {
        socket.emit("userLoggedOut", currentUser.id);
      }
    };
  }, [socket, currentUser]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handleUploadImageVideoOpen = () => {
    setOpenimgvid((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await UploadFile(file);

    setImageUrl(uploadPhoto?.url);
    setLoading(false);
    setOpenimgvid(false);
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await UploadFile(file);

    setVideoUrl(uploadPhoto?.url);
    setLoading(false);
    setOpenimgvid(false);
  };

  const handleClearImage = () => {
    setImageUrl("");
  };

  const handleClearVideo = () => {
    setVideoUrl("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "" && !imageUrl && !videoUrl) return;

    const messageData = {
      senderId: currentUser.id || currentUser._id,
      receiverId: userId,
      text: newMessage || "",
      videoUrl: videoUrl,
      imageUrl: imageUrl,
      timestamp: new Date(),
      conversationId: conversation ? conversation._id : null,
      _id: Date.now().toString(),
    };

    socket.emit("sendMessage", messageData);

    setNewMessage("");
    setImageUrl("");
    setVideoUrl("");
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short" };
    const date = new Date(dateString).toLocaleDateString(undefined, options);

    const timeOptions = { hour: "numeric", minute: "numeric" };
    const time = new Date(dateString).toLocaleTimeString(
      undefined,
      timeOptions
    );

    return `${date}- ${time}`;
  };

  return (
    <div className="conversation-container">
      <div className="conversation-heading">
        <Link to="/" className="Circle-icon">
          <IoMdArrowDropleft size={30} />
        </Link>

        {user && user.profile_pic ? (
          <img
            className="Image-alignment"
            src={user.profile_pic}
            alt="profilepic"
          />
        ) : (
          <IoPersonCircle size={50} className="Image-alignment" />
        )}
        <div className="User-name">
          <h6>{user?.name}</h6>
          <p>{userStatus}</p>
        </div>
      </div>
      <div className="Message-conversation-container scrollbar">
        <div className="message-container-align">
          {messages.map((message) => (
            <div
              ref={messageContainerRef}
              key={message._id}
              className={`Message-box ${
                message.senderId === (currentUser.id || currentUser._id)
                  ? "own"
                  : "other"
              }`}
            >
              <div
                ref={messageContainerRef}
                className="image-content-container"
              >
                {message?.imageUrl && (
                  <img
                    src={message?.imageUrl}
                    className="get-image-content"
                    alt="img"
                  />
                )}
              </div>
              <div className="image-content-container">
                {message?.videoUrl && (
                  <video
                    src={message?.videoUrl}
                    className="get-image-content"
                    controls
                  />
                )}
              </div>
              <div className="Message-align">
                <p className={`Message-text-align `}>{message.text}</p>
                <p className="Date-align">{formatDate(message.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>

        {imageUrl && (
          <div className="image-video-upload-container rounded">
            <div className="CloseTag-alignment" onClick={handleClearImage}>
              <IoCloseCircle size={30} />
            </div>
            <div className="bg-white p-3 image-alignment">
              <img
                src={imageUrl}
                alt="uploadimag"
                width={250}
                height={250}
                className="align-content"
              />
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="image-video-upload-container rounded">
            <div className="CloseTag-alignment" onClick={handleClearVideo}>
              <IoCloseCircle size={30} />
            </div>
            <div className="bg-white p-3 image-alignment">
              <video
                src={videoUrl}
                width={250}
                height={250}
                className="align-content"
                controls
              />
            </div>
          </div>
        )}
      </div>
      {loading && <div className="Loading-content"><Loading/> </div>}
      <div className="Main-input-container">
        <div className="plus-btn-container">
          <button
            onClick={handleUploadImageVideoOpen}
            className="plus-icon-align"
          >
            <BiPlusCircle size={25} />
          </button>

          {openimgvid && (
            <div className="video-image-icon-container p-3 shadow rounded">
              <form>
                <div className="icon-Box">
                  <label
                    htmlFor="upload-image"
                    className="icon-alignment rounded p-1 px-2"
                  >
                    <div className="image-icon">
                      <IoIosImages size={25} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label
                    htmlFor="upload-video"
                    className="icon-alignment rounded px-2"
                  >
                    <div className="video-icon">
                      <MdVideoLibrary size={25} />
                    </div>
                    <p>Video</p>
                  </label>
                </div>
                <input
                  className="d-none"
                  type="file"
                  id="upload-image"
                  onChange={handleUploadImage}
                />
                <input
                  className="d-none"
                  type="file"
                  id="upload-video"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            className="input-message-box"
            type="text"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="send-icon-align">
            <RiSendPlane2Fill size={25} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationPage;
