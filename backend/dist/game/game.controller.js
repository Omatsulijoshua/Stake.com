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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const decimal_js_1 = require("decimal.js");
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    async playDice(req, amount, target, condition) {
        return this.gameService.playDice(req.user.id, new decimal_js_1.Decimal(amount), target, condition);
    }
    async playRoulette(req, amount, betType) {
        return this.gameService.playRoulette(req.user.id, new decimal_js_1.Decimal(amount), betType);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)('dice'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('target')),
    __param(3, (0, common_1.Body)('condition')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "playDice", null);
__decorate([
    (0, common_1.Post)('roulette'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('betType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "playRoulette", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('games'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map