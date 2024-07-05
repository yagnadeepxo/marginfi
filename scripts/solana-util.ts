
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-react';


export const solanaConnection = new Connection(
  'https://api.devnet.solana.com',
  'confirmed'
);


export const connectPhantomWallet = async (): Promise<WalletAdapter | undefined> => {
  const { getPhantomWallet } = await import('@solana/wallet-adapter-wallets');
  const { WalletAdapter } = await import('@solana/wallet-adapter-react');

  const phantomWallet = getPhantomWallet();
  const wallet = new WalletAdapter({
    provider: phantomWallet,
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: 'https://www.phantom.app/favicon.ico',
  });

  try {
    await wallet.connect();
    return wallet;
  } catch (error) {
    console.error('Failed to connect to Phantom wallet', error);
    return undefined;
  }
};
