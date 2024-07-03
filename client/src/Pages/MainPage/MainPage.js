import React from "react";
import logo from "../../Assests/logo4.png";
import "./MainPage.css";

const Mainpage = ({ children }) => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center py-3 h-25 shadow-sm Main-align">
        <img src={logo} alt="logo" height={70} width={200} />
      </div>

      {children}
    </>
  );
};

export default Mainpage;
