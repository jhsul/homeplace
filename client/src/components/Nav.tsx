import { FunctionComponent, useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import connection from "../connection";
import useUser from "../hooks/user";
import Login from "./Login";
import Signup from "./Signup";

const Nav: FunctionComponent = () => {
  const { username, mutate } = useUser();
  const [usersOnline, setUsersOnline] = useState<number | null>(null);

  //const user = { name: "John Doe" };

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    connection.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message?.type === "userCount") {
        setUsersOnline(message.data as number);
      }
    });

    connection.addEventListener("error", (event) => {
      setUsersOnline(null);
    });
  }, []);

  const handleLogout = async () => {
    if (!username) {
      console.log("User is not logged in");
      return;
    }

    await fetch("/me", { method: "DELETE" });

    mutate(null);
  };
  //        className="navbar navbar-expand-md navbar-light bg-light fixed-top px-2 mx-0"

  return (
    <nav
      className="navbar navbar-expand-md navbar-light bg-light fixed-top px-2 mx-0"
      id="navbar"
    >
      {usersOnline ? (
        <a className="navbar-brand text-success" href="#">
          {`Connected (${usersOnline} online)`}
        </a>
      ) : (
        <a className="navbar-brand text-danger" href="#">
          Not Connected :(
        </a>
      )}

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

          {username ? (
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
                {`Hello, ${username}`}
              </a>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <a className="dropdown-item" onClick={handleLogout}>
                  Log Out
                </a>
              </div>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={function () {
                    setIsLoggingIn(true);
                  }}
                >
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={function () {
                    setIsSigningUp(true);
                  }}
                >
                  Signup
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <Modal
        show={isLoggingIn}
        onHide={function () {
          setIsLoggingIn(false);
        }}
      >
        <Login
          setIsLoggingIn={function (value) {
            setIsLoggingIn(value);
          }}
        />
      </Modal>

      <Modal
        show={isSigningUp}
        onHide={function () {
          setIsSigningUp(false);
        }}
      >
        <Signup
          setIsSigningUp={function (value) {
            setIsSigningUp(value);
          }}
        />
      </Modal>
    </nav>
  );
};

export default Nav;
