import React, { useState } from "react";
import "../style/Header.css";
import { Link  } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import Logo from "../images/Logo.avif";
import Basket from "./Basket";

function Header() {
  const [{ user, userDetailsContext }] = useStateValue();
  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
    }
  };
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  return (
    <>
      <nav className="navbar">
        <Link to="/" onClick={closeMobileMenu}>
          <img className="header__logo" src={Logo} alt="logo" />
        </Link>
        <div className={click? "hidden": "menu-icon"} onClick={handleClick}>
          {/* <img src="https://img.icons8.com/material-rounded/96/000000/menu--v3.png"/> */}
          {/* <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-menu-web-flaticons-lineal-color-flat-icons.png"/> */}
          <img src="https://img.icons8.com/external-bluetone-bomsymbols-/91/000000/external-hamburger-menu-digital-design-bluetone-set-2-bluetone-bomsymbols-.png"/>
          
        </div>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item ">
            <Link
              to=""
              className="nav-links nav-back "
              onClick={closeMobileMenu}
            >
              Back
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-links mob1" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/allproducts"
              className="nav-links mob2"
              onClick={closeMobileMenu}
            >
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={user ? "/account" : !user && "/login"}
              className="nav-links username"
              onClick={closeMobileMenu}
            >
              Hello
              {!user
                ? ` Guest`
                : userDetailsContext == null
                ? ` Loading`
                : userDetailsContext == undefined
                ? ` Loading`
                : ` ${userDetailsContext[0]?.firstname}`}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={!user && "/login"}
              className="nav-links userauth"
              onClick={handleAuthenticaton}
            >
              {user ? "Sign out" : "Sign up" }
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/checkout"
              className="nav-links header__optionBasket "
              onClick={closeMobileMenu}
            >
              <Basket />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
