const url = `wss://${location.host}`;

console.log(`Establishing websocket connection with ${url}`);
const connection = new WebSocket(url);

export default connection;
