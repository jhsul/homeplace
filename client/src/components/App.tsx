import React, { FunctionComponent, useEffect, useState } from "react";
import connection from "../connection";
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
    <div className="vbox">
      <Nav />
      <h1>Messages</h1>
      <div>{JSON.stringify(messages)}</div>

      {error && <div>{JSON.stringify(error)} </div>}

      <Login />

      <br />

      <Signup />
    </div>
  );
};

export default App;
