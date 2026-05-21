"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const nacl = __importStar(require("tweetnacl"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async getNonce(walletAddress) {
        const nonce = Math.floor(Math.random() * 1000000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.session.upsert({
            where: { nonce },
            update: { expiresAt },
            create: {
                userId: await this.getOrCreateUser(walletAddress),
                nonce,
                expiresAt,
            },
        });
        return { nonce };
    }
    async getOrCreateUser(walletAddress) {
        let user = await this.prisma.user.findUnique({
            where: { walletAddress },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: { walletAddress },
            });
        }
        return user.id;
    }
    async verifySignature(walletAddress, signature, nonce) {
        const session = await this.prisma.session.findUnique({
            where: { nonce },
            include: { user: true },
        });
        if (!session || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired nonce');
        }
        if (session.user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new common_1.UnauthorizedException('Wallet address mismatch');
        }
        const isValid = await this.verify(walletAddress, signature, nonce);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        await this.prisma.session.delete({ where: { id: session.id } });
        const payload = { sub: session.userId, walletAddress };
        return {
            accessToken: this.jwtService.sign(payload),
            user: session.user,
        };
    }
    async verify(walletAddress, signature, nonce) {
        const message = `Login to Stake.com: ${nonce}`;
        try {
            const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
            if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
                return true;
            }
        }
        catch (e) {
        }
        try {
            const pubKey = new web3_js_1.PublicKey(walletAddress);
            const signatureUint8 = Buffer.from(signature, 'base64');
            const messageUint8 = new TextEncoder().encode(message);
            return nacl.sign.detached.verify(messageUint8, signatureUint8, pubKey.toBytes());
        }
        catch (e) {
        }
        return false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map