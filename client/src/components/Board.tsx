import { FunctionComponent, useEffect, useRef } from "react";

import homerUrl from "../assets/homer.png";

const Board: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log("Fetching board bitmap");
    console.log(canvasRef.current);
    console.log(containerRef.current);

    containerRef.current?.focus();

    const homer = new Image();
    homer.src = homerUrl;

    homer.onload = () => {
      console.log("Homer bitmap loaded");
      if (!canvasRef.current) {
        return;
      }
      canvasRef.current.getContext("2d")?.drawImage(homer, 0, 0, 512, 512);
    };
  }, []);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    console.log(e);
  };

  return (
    <div ref={containerRef} className="board-container" onScroll={handleScroll}>
      <canvas ref={canvasRef} width="512" height="512"></canvas>
    </div>
  );
};

export default Board;
