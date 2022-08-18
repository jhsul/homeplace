import { AppState } from "./components/App";

const place = async ({ x, y, color }: AppState) => {
  console.log(`Placing ${color} at ${x},${y}`);
  const res = await fetch("/place", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y, color }),
  });

  if (res.status !== 200) {
    const { error } = await res.json();
    return error;
  }
  return null;
};

export default place;
