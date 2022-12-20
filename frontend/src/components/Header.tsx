import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {  BsPersonFill } from "react-icons/bs";

type Props = {
  currentUser: any;
  signOut: () => void;
};

function Header({ currentUser, signOut }: Props) {
  return (
    <div className="home-page-header">
      <li className="logo">
       <a href="/homepage"> <img src={logo} width="200px" alt="indeed-logo" /> </a>
      </li>
      {currentUser === null ? (
          <>
      <ul className="header-btn">
        <li className="signup">
          <button>
            <NavLink to="/signup">Sign up</NavLink>
          </button>
        </li>
        <li className="signin">
          <button>
            {" "}
            <NavLink to="/signin">Sign in</NavLink>
          </button>
        </li>
      </ul>
      </>
      ) : (
        <div className="signedin">
          {currentUser.role === "ADMIN"?(
            <Link to={"/profile"}>
            <div className="username">
            <li className="react-icon">
             <BsPersonFill />
              </li>
            <li>
                {currentUser.name}
              </li>
              </div>
              </Link>
          ):(
            <div className="username">
            <li className="react-icon">
             <BsPersonFill />
              </li>
            <li>
                {currentUser.name}
              </li>
              </div>
          )}
          
            <button
              onClick={() => {
                signOut();
                localStorage.removeItem("token");
              }}
            >
              Sign out
            </button>
        </div>
         )}
    </div>
  );
}

export default Header;
