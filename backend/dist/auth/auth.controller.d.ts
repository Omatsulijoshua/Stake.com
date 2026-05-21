import { AuthService } from './auth.service';
import { LoginDto, NonceDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getNonce(nonceDto: NonceDto): Promise<{
        nonce: string;
    }>;
    login(loginDto: LoginDto, nonce: string): Promise<{
        accessToken: string;
        user: any;
    }>;
}
