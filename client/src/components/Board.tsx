import { FunctionComponent, useEffect, useRef, useState } from "react";

import homerUrl from "../assets/homer.png";
import colors from "../colors";
import Placer from "./Placer";

const Board: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [placerTempPos, setPlacerTempPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    // async iife
    (async () => {
      console.log("Loading board bitmap");
      const res = await fetch("/board");
      const buffer = await res.arrayBuffer();
      const view = new DataView(buffer);

      // Render the canvas
      const context = canvasRef.current!.getContext("2d");

      //const originalData = new Uint8Array(buffer);

      const mappedData = new Uint8ClampedArray(512 * 512 * 4);

      //const imageData = context.createImageData()

      console.log(buffer.byteLength, "bytes");

      for (let i = 0; i < buffer.byteLength; i++) {
        const byte = view.getUint8(i);
        //console.log(byte);
        const colorA = parseInt(colors[byte & 0x0f].slice(1), 16);
        const colorB = parseInt(colors[(byte & 0xf0) >> 4].slice(1));

        mappedData[i * 8] = (colorA & 0xff000000) >> 24;
        mappedData[i * 8 + 1] = (colorA & 0x00ff0000) >> 16;
        mappedData[i * 8 + 2] = (colorA & 0x0000ff00) >> 8;
        mappedData[i * 8 + 3] = colorA & 0x000000ff;

        mappedData[i * 8 + 4] = (colorB & 0xff000000) >> 24;
        mappedData[i * 8 + 5] = (colorB & 0x00ff0000) >> 16;
        mappedData[i * 8 + 6] = (colorB & 0x0000ff00) >> 8;
        mappedData[i * 8 + 7] = colorB & 0x000000ff;
      }

      console.log(mappedData);

      context?.putImageData(new ImageData(mappedData, 512, 512), 0, 0);

      //const imageData = context?.createImageData(mappedData, 512, 412);
    })();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setPlacerTempPos({ x: e.clientX, y: e.clientY });
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    console.log(e);
  };

  return (
    <div ref={containerRef} className="board-container" onScroll={handleScroll}>
      <canvas
        ref={canvasRef}
        width="512"
        height="512"
        onClick={handleClick}
        id="board"
      ></canvas>
      <Placer x={placerTempPos.x} y={placerTempPos.y} />
    </div>
  );
};

export default Board;
