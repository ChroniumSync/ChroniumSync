import { Connection, PublicKey, ParsedAccountData, Commitment } from "@solana/web3.js";

export interface TokenAccountInfo {
  pubkey: string;
  mint: string;
  amount: number;
  decimals: number;
}

export class TokenCheckService {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
  }


  async getTokenAccountsByOwner(
    ownerAddress: string,
    commitment: Commitment = "confirmed"
  ): Promise<TokenAccountInfo[]> {
    const ownerPublicKey = new PublicKey(ownerAddress);
    const response = await this.connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") },
      commitment
    );

    return response.value.map((accountInfo) => {
      const parsed = accountInfo.account.data as ParsedAccountData;
      const info = parsed.parsed.info;
      return {
        pubkey: accountInfo.pubkey.toBase58(),
        mint: info.mint,
        amount: parseInt(info.tokenAmount.amount, 10),
        decimals: info.tokenAmount.decimals,
      };
    });
  }

  /**
   * Retrieves the balance for a specific token mint.
   * @param ownerAddress - The public key of the wallet owner.
   * @param mintAddress - The public key of the token mint.
   */
  async getTokenBalance(
    ownerAddress: string,
    mintAddress: string
  ): Promise<number> {
    const accounts = await this.getTokenAccountsByOwner(ownerAddress);
    const matching = accounts.find((acct) => acct.mint === mintAddress);
    if (!matching) {
      return 0;
    }
    // Convert raw amount to human-readable balance
    return matching.amount / Math.pow(10, matching.decimals);
  }
}
