import { FunctionComponent, useState } from "react";

import Modal from "react-modal";
import useUser from "../hooks/user";
import Login from "./Login";

const Nav: FunctionComponent = () => {
  const { user } = useUser();

  //const user = { name: "John Doe" };

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-light px-2">
        <a className="navbar-brand" href="#">
          {user ? `Hello, ${user.name}` : "Welcome :)"}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="https://pages.jackhsullivan.com">
                About
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                My Links
              </a>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <a className="dropdown-item" href="#">
                  GitHub
                </a>
                <a className="dropdown-item" href="#">
                  LinkedIn
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Resume
                </a>
              </div>
            </li>

            {user ? (
              <li className="nav-item">
                <button className="btn btn-danger">Log Out</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={function () {
                      setIsLoggingIn(true);
                    }}
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <button className="btn btn-primary">Sign Up</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <Modal
        isOpen={isLoggingIn}
        onRequestClose={function () {
          setIsLoggingIn(false);
        }}
        contentLabel="Log In"
      >
        <Login />
      </Modal>
    </>
  );
};

export default Nav;
