import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import homerUrl from "../assets/homer.png";
import colors from "../colors";
import connection from "../connection";
import place from "../place";
import { AppStateContext } from "./App";

interface BoardState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const Board: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { appState, setAppState } = useContext(AppStateContext);

  const [boardState, setBoardState] = useState<BoardState>({
    scale: 4,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    connection.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message?.type === "placement") {
        const context = canvasRef.current!.getContext("2d");

        if (!context) return; //lol

        console.log("Live placement", message);

        context.fillStyle = colors[message.data.color];
        context.fillRect(message.data.x, message.data.y, 1, 1);
      }
    }); // async iife
    (async () => {
      console.log("Loading board bitmap");
      const res = await fetch("/board");
      const buffer = await res.arrayBuffer();

      console.log(buffer);
      const view = new DataView(buffer);
      // Render the canvas
      const context = canvasRef.current!.getContext("2d");

      if (!context) return;

      context.imageSmoothingEnabled = false;

      //const originalData = new Uint8Array(buffer);

      const mappedData = new Uint8ClampedArray(512 * 512 * 4);

      //const imageData = context.createImageData()

      console.log(buffer.byteLength, "bytes");

      for (let i = 0; i < buffer.byteLength; i++) {
        const byte = view.getUint8(i);

        if (byte !== 0) {
          //console.log(byte + " at " + i);
        }
        //console.log(byte);
        const colorB = parseInt(colors[byte & 0x0f].slice(1), 16);
        const colorA = parseInt(colors[(byte & 0xf0) >> 4].slice(1), 16);

        //console.log(colorA, colorB);

        mappedData[i * 8] = (colorA & 0xff0000) >> 16;
        mappedData[i * 8 + 1] = (colorA & 0x00ff00) >> 8;
        mappedData[i * 8 + 2] = colorA & 0x0000ff;
        mappedData[i * 8 + 3] = 0xff; // ALPHA ALWAYS FULL
        //mappedData[i * 8 + 3] = colorA & 0x000000ff;

        mappedData[i * 8 + 4] = (colorB & 0xff0000) >> 16;
        mappedData[i * 8 + 5] = (colorB & 0x00ff00) >> 8;
        mappedData[i * 8 + 6] = colorB & 0x0000ff;
        mappedData[i * 8 + 7] = 0xff; // ALPHA ALWAYS FULL

        //mappedData[i * 8 + 7] = colorB & 0x000000ff;
      }

      console.log(mappedData);

      context?.putImageData(new ImageData(mappedData, 512, 512), 0, 0);

      //const imageData = context?.createImageData(mappedData, 512, 412);
    })();
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const error = await place(appState);

    setAppState((s) => ({ ...s, error }));

    if (error) {
      console.error(error);
    }
  };

  const handleMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((e.clientX - rect.left) / boardState.scale);
    const y = Math.floor((e.clientY - rect.top) / boardState.scale);
    setAppState((s) => ({ ...s, x, y }));
  };
  //          transform: `scale(${boardState.scale}) translateX(calc(-50% / ${boardState.scale})) translateY(25%)`,

  return (
    <div ref={containerRef}>
      <canvas
        ref={canvasRef}
        width="512"
        height="512"
        onClick={handleClick}
        onMouseMove={handleMouse}
        style={{
          //border: "1px solid black",
          imageRendering: "pixelated",
          transform: `scale(${boardState.scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      ></canvas>
    </div>
  );
};

export default Board;
