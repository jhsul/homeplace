import React, { FunctionComponent, useEffect, useState } from "react";
import Modal from "react-modal";

import connection from "../connection";
import Board from "./Board";
import Login from "./Login";
import Nav from "./Nav";
import Palette from "./Palette";
import Signup from "./Signup";

const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export interface AppState {
  x: number;
  y: number;
  color: number;
  error: string | null;
}

export const AppStateContext = React.createContext<{
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  //@ts-ignore
}>({}); // SMH the context api needs work

const App: FunctionComponent = () => {
  const [appState, setAppState] = useState<AppState>({
    x: 0,
    y: 0,
    color: getRandomIntInclusive(1, 15),
    error: null,
  });
  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      <div id="app">
        <Nav />
        <Board />
        <Palette />
      </div>
    </AppStateContext.Provider>
  );
};

export default App;
