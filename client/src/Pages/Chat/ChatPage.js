import React from "react";
import "./ChatPage.css";
import { Outlet } from 'react-router-dom';
import ContactPage from "../Contacts/ContactPage";
import UsersPage from "../UsersPage/UsersPage";

const ChatPage = () => {
  return (
    <div className="ChatPage-container">
      <div className="Contacts-Container">
        <ContactPage />
      </div>
      <div className="Message-Container">
         <Outlet />  
      </div>
      <div className="Users-container">
        <UsersPage />
      </div>
    </div>
  );
};

export default ChatPage;
