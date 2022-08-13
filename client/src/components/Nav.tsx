import { FunctionComponent, useState } from "react";

import Modal from "react-modal";
import useUser from "../hooks/user";
import Login from "./Login";

const Nav: FunctionComponent = () => {
  const { user, mutate } = useUser();

  //const user = { name: "John Doe" };

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogout = () => {
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    console.log(`Logging out user ${user}`);
    document.cookie = `${import.meta.env.COOKIE!}`;

    mutate(null);
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top px-2">
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
            <li className="nav-item dropdown">
              <a
                className="dropdown-toggle btn btn-outline-secondary"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user ? `Hello, ${user.name}` : "Guest"}
              </a>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                {user ? (
                  <>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Log Out
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      className="dropdown-item"
                      role="button"
                      onClick={function () {
                        setIsLoggingIn(true);
                      }}
                    >
                      Log In
                    </a>
                    <a
                      className="dropdown-item"
                      role="button"
                      onClick={function () {
                        setIsSigningUp(true);
                      }}
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            </li>
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
