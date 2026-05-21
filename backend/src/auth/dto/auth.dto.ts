import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class NonceDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
