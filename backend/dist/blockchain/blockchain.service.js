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
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const prisma_service_1 = require("../prisma/prisma.service");
const wallet_service_1 = require("../wallet/wallet.service");
let BlockchainService = BlockchainService_1 = class BlockchainService {
    prisma;
    walletService;
    ethProvider;
    solConnection;
    logger = new common_1.Logger(BlockchainService_1.name);
    constructor(prisma, walletService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.ethProvider = new ethers_1.ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
        this.solConnection = new web3_js_1.Connection(process.env.SOL_RPC_URL, 'confirmed');
    }
    onModuleInit() {
        this.listenToEthereum();
        this.listenToSolana();
    }
    async listenToEthereum() {
        this.logger.log('Starting Ethereum listener...');
    }
    async listenToSolana() {
        this.logger.log('Starting Solana listener...');
    }
    async sendEth(to, amount) {
        const wallet = new ethers_1.ethers.Wallet(process.env.ETH_HOT_WALLET_PRIVATE_KEY, this.ethProvider);
        const tx = await wallet.sendTransaction({
            to,
            value: ethers_1.ethers.parseEther(amount.toString()),
        });
        return tx.hash;
    }
    async sendSol(to, amount) {
        const fromWallet = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOL_HOT_WALLET_PRIVATE_KEY)));
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: new web3_js_1.PublicKey(to),
            lamports: amount.mul(1e9).toNumber(),
        }));
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(this.solConnection, transaction, [fromWallet]);
        return signature;
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map