import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class LeaderboardGateway {
    @WebSocketServer()
    server: Server

    emitLeaderBoard(data: any) {
        this.server.emit('leaderboardUpdate', data)
    }
}