import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
});
// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
//   autoConnect: true,
// });

export default socket;
