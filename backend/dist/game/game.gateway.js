"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const jwt_1 = require("@nestjs/jwt");
let GameGateway = class GameGateway {
    gameService;
    jwtService;
    server;
    activeGames = new Map();
    constructor(gameService, jwtService) {
        this.gameService = gameService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token)
                throw new common_1.UnauthorizedException();
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;
        }
        catch (e) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinCrash(client) {
        client.join('crash_game');
    }
    async startCrashRound() {
        const crashPoint = 2.5;
        let currentMultiplier = 1.0;
        const interval = setInterval(() => {
            currentMultiplier += 0.01 * Math.pow(currentMultiplier, 1.2);
            if (currentMultiplier >= crashPoint) {
                this.server.to('crash_game').emit('crash_result', { multiplier: currentMultiplier, crashed: true });
                clearInterval(interval);
            }
            else {
                this.server.to('crash_game').emit('crash_update', { multiplier: currentMultiplier });
            }
        }, 100);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_crash'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinCrash", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        jwt_1.JwtService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map