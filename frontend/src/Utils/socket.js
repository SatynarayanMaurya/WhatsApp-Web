import { io } from "socket.io-client";

const BASE_URL ="https://whatsapp-web-r6dr.onrender.com"

const socket = io(BASE_URL, {
  withCredentials: true,
});

export default socket;
