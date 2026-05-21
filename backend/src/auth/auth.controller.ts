import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, NonceDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  async getNonce(@Body() nonceDto: NonceDto) {
    return this.authService.getNonce(nonceDto.walletAddress);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Body('nonce') nonce: string) {
    return this.authService.verifySignature(loginDto.walletAddress, loginDto.signature, nonce);
  }
}
