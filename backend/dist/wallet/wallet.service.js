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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const decimal_js_1 = require("decimal.js");
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        return user?.balance || new decimal_js_1.Decimal(0);
    }
    async updateBalance(userId, amount, type, txHash, currency = client_1.Currency.ETH) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
            });
            if (!user)
                throw new Error('User not found');
            const newBalance = new decimal_js_1.Decimal(user.balance).add(amount);
            if (newBalance.lt(0)) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            await tx.user.update({
                where: { id: userId },
                data: { balance: newBalance },
            });
            return await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type,
                    currency,
                    txHash,
                    status: client_1.TransactionStatus.COMPLETED,
                    network: currency === client_1.Currency.SOL ? client_1.Network.SOLANA : client_1.Network.ETHEREUM,
                },
            });
        });
    }
    async requestWithdrawal(userId, amount, currency) {
        const balance = await this.getBalance(userId);
        if (balance.lt(amount)) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });
            return await tx.withdrawalRequest.create({
                data: {
                    userId,
                    amount,
                    currency,
                    status: 'PENDING',
                },
            });
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map