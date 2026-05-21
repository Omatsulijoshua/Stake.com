export declare class FairService {
    generateServerSeed(): string;
    hashServerSeed(serverSeed: string): string;
    generateResult(serverSeed: string, clientSeed: string, nonce: number): number;
}
