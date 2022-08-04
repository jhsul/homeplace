import { FunctionComponent, useEffect, useRef } from "react";

const Board: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    console.log("Fetching board bitmap");
    console.log(canvasRef.current);
  }, []);
  return (
    <div className="board-container">
      <canvas ref={canvasRef} width="512" height="512"></canvas>
    </div>
  );
};

export default Board;
