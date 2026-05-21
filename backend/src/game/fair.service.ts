import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class FairService {
  generateServerSeed(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashServerSeed(serverSeed: string): string {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  }

  // Generate a random number based on seeds
  // Returns a value between 0 and 1
  generateResult(serverSeed: string, clientSeed: string, nonce: number): number {
    const combined = `${serverSeed}:${clientSeed}:${nonce}`;
    const hash = crypto.createHmac('sha256', serverSeed).update(combined).digest('hex');
    
    // Take first 8 characters (32 bits) and convert to integer
    const intValue = parseInt(hash.substring(0, 8), 16);
    return intValue / Math.pow(2, 32);
  }
}
