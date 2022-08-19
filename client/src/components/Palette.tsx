import React from "react";
import { FunctionComponent, useState } from "react";
import colors from "../colors";
import { AppStateContext } from "./App";

const Palette: FunctionComponent = () => {
  const { appState, setAppState } = React.useContext(AppStateContext);

  /*
  const handlePlace = async (value: number) => {
    console.log("Placing", value, "at", x, y);
    const res = await fetch("/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, color: value }),
    });

    if (res.status !== 200) {
      const { error } = await res.json();
      setError(error);
      return;
    }
    setError(null);
  };
  */

  return (
    <nav
      className="navbar navbar-light bg-light fixed-bottom px-2 mx-0"
      style={{ justifyContent: "space-around", flex: 0 }}
      id="palette"
    >
      <div className="placer">
        <p className="lead">
          {appState.error ? (
            <i className="text-danger lead">{appState.error}</i>
          ) : (
            <i>{`${appState.x}, ${appState.y}`}</i>
          )}
        </p>
        <div
          style={{
            display: "grid",
            width: "fit-content",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          }}
        >
          {colors.map((color, i) => (
            <div
              onClick={() => {
                setAppState((s) => ({ ...s, color: i }));
              }}
              key={i}
              style={{
                backgroundColor: color,
                margin: "5pt",
                width: "20pt",
                height: "20pt",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //gridRow: Math.floor(i / 8),
                //gridColumn: i % 8,
              }}
            >
              {i === appState.color && (
                <div
                  style={{
                    height: "10pt",
                    width: "10pt",
                    backgroundColor: "white",
                    border: "1px solid black",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Palette;
