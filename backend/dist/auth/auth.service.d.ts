import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getNonce(walletAddress: string): Promise<{
        nonce: string;
    }>;
    private getOrCreateUser;
    verifySignature(walletAddress: string, signature: string, nonce: string): Promise<{
        accessToken: string;
        user: any;
    }>;
    private verify;
}
