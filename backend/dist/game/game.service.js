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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wallet_service_1 = require("../wallet/wallet.service");
const fair_service_1 = require("./fair.service");
const client_1 = require("@prisma/client");
const decimal_js_1 = require("decimal.js");
let GameService = class GameService {
    prisma;
    walletService;
    fairService;
    constructor(prisma, walletService, fairService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.fairService = fairService;
    }
    async playDice(userId, amount, target, condition) {
        const MIN_BET = new decimal_js_1.Decimal('0.0001');
        const MAX_BET = new decimal_js_1.Decimal('100');
        const MAX_WIN = new decimal_js_1.Decimal('500');
        if (amount.lt(MIN_BET))
            throw new common_1.BadRequestException('Bet amount too low');
        if (amount.gt(MAX_BET))
            throw new common_1.BadRequestException('Bet amount too high');
        if (target < 0.01 || target > 99.99)
            throw new common_1.BadRequestException('Invalid target');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.status === 'SUSPENDED') {
            throw new common_1.BadRequestException('Account suspended or not found');
        }
        const balance = await this.walletService.getBalance(userId);
        if (balance.lt(amount))
            throw new common_1.BadRequestException('Insufficient balance');
        const serverSeed = this.fairService.generateServerSeed();
        const hash = this.fairService.hashServerSeed(serverSeed);
        const gameSession = await this.prisma.gameSession.create({
            data: {
                gameType: client_1.GameType.DICE,
                serverSeed,
                hash,
                nonce: 1,
            },
        });
        const clientSeed = 'default_client_seed';
        const resultValue = this.fairService.generateResult(serverSeed, clientSeed, gameSession.nonce) * 100;
        let isWin = false;
        if (condition === 'over') {
            isWin = resultValue > target;
        }
        else {
            isWin = resultValue < target;
        }
        const winChance = condition === 'over' ? 100 - target : target;
        const multiplier = winChance > 0 ? new decimal_js_1.Decimal(99).div(winChance) : new decimal_js_1.Decimal(0);
        const payout = isWin ? amount.mul(multiplier) : new decimal_js_1.Decimal(0);
        await this.walletService.updateBalance(userId, isWin ? payout.sub(amount) : amount.neg(), isWin ? client_1.TransactionType.BET_WIN : client_1.TransactionType.BET_PLACE);
        const bet = await this.prisma.bet.create({
            data: {
                userId,
                gameType: client_1.GameType.DICE,
                amount,
                multiplier,
                payout,
                result: isWin ? client_1.BetResult.WIN : client_1.BetResult.LOSS,
                gameSessionId: gameSession.id,
            },
        });
        return {
            bet,
            resultValue,
            isWin,
            serverSeed,
        };
    }
    async playRoulette(userId, amount, betType) {
        const balance = await this.walletService.getBalance(userId);
        if (balance.lt(amount))
            throw new common_1.BadRequestException('Insufficient balance');
        const serverSeed = this.fairService.generateServerSeed();
        const resultValue = Math.floor(this.fairService.generateResult(serverSeed, 'client_seed', 1) * 37);
        const ROULETTE_RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        let isWin = false;
        let multiplier = new decimal_js_1.Decimal(0);
        if (betType === 'green' && resultValue === 0) {
            isWin = true;
            multiplier = new decimal_js_1.Decimal(14);
        }
        else if (betType === 'red' && ROULETTE_RED.includes(resultValue)) {
            isWin = true;
            multiplier = new decimal_js_1.Decimal(2);
        }
        else if (betType === 'black' && resultValue !== 0 && !ROULETTE_RED.includes(resultValue)) {
            isWin = true;
            multiplier = new decimal_js_1.Decimal(2);
        }
        const payout = isWin ? amount.mul(multiplier) : new decimal_js_1.Decimal(0);
        await this.walletService.updateBalance(userId, isWin ? payout.sub(amount) : amount.neg(), isWin ? client_1.TransactionType.BET_WIN : client_1.TransactionType.BET_PLACE);
        return { resultValue, isWin, payout };
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        fair_service_1.FairService])
], GameService);
//# sourceMappingURL=game.service.js.map