import { FunctionComponent, useState } from "react";
import colors from "../colors";

interface PlacerProps {
  x: number;
  y: number;
}

const Placer: FunctionComponent<PlacerProps> = ({ x, y }) => {
  const [error, setError] = useState<string | null>(null);

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
    console.log("Place successful");
  };
  return (
    <div className="placer">
      <b>{`${x}, ${y}`}</b>
      {error && <p className="text-danger">{error}</p>}
      <div style={{ display: "grid" }}>
        {colors.map((color, i) => (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              handlePlace(i);
            }}
            key={i}
            style={{ gridRow: Math.floor(i / 8) }}
          >
            <div
              style={{
                backgroundColor: color,
                width: "20pt",
                height: "20pt",
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Placer;
