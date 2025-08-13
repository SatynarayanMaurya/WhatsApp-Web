import { io } from "socket.io-client";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "http://192.168.1.19:4000";

const socket = io(BASE_URL, {
  withCredentials: true,
});

export default socket;
