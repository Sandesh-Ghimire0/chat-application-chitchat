
import WebSocket from "ws";

export interface ClientSocket extends WebSocket {
    clientId:string
    username?:string
    userId?: string
}