import {io} from "socket.io-client"

function clientServer(){
 return io("http://localhost:3000")
}
export default clientServer