import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { io } from "socket.io-client";
import './UsersPage.css';
import Loading from "../Loader/Loader";

const UsersPage = () => {
 
  const [users, setUsers] = useState([]);
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

    newSocket.on("users", (data) => {
      setUsers(data);
      setLoading(false);
    });

    

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (loading) return <div className="Loader-align" ><Loading/></div>;

  const handleUserClick = (userId) => {
    navigate(`/conversation/${userId}`);
  };

  return (
    <div>
      <h4 className="heading" >Users List</h4>
      <div className="Messages-alignment Userpage-alignment">
        <div className="Message-container scrollbar">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="message-box1"
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
                  <p className="email-align" >{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div>Start a new conversation</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
