import React, { FunctionComponent, useEffect, useState } from "react";
import Modal from "react-modal";

import connection from "../connection";
import Board from "./Board";
import Login from "./Login";
import Nav from "./Nav";
import Signup from "./Signup";

const App: FunctionComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log("Assigning hook logic to websocket events");

    connection.onerror = (err) => {
      setError(err);
    };
    connection.onmessage = (ev) => {
      setMessages((msgs: any[]) => [...msgs, ev.data]);
    };
  }, []);
  return (
    <div id="app" className="vbox">
      <Nav />
      <Board />
    </div>
  );
};

export default App;
