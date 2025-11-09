import { io } from "socket.io-client"

function clientServer() {
  return io("https://chat-app-react-zrys.onrender.com", {
    transports: ["websocket"],  // force WebSocket only
    withCredentials: true,      // allow cross-domain cookies if needed
  })
}

export default clientServer