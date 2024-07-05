import { solanaConnection, connectPhantomWallet } from './solana-util';
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from '@mrgnlabs/mrgn-common';

const CLUSTER_CONNECTION = 'https://api.devnet.solana.com';

const main = async () => {
  try {
    // Connect Phantom wallet
    const wallet = await connectPhantomWallet();
    if (!wallet) {
      console.error('Phantom wallet connection failed.');
      return;
    }

    // Initialize Marginfi client
    const connection = solanaConnection;
    const config = getConfig('dev');
    const client = await MarginfiClient.fetch(config, NodeWallet.local(), connection);

    // Create Marginfi account
    const marginfiAccount = await client.createMarginfiAccount();
    console.log('Marginfi account created:', marginfiAccount.address.toBase58());

    // lend
    const bankLabel = 'SOL';
    const bank = client.getBankByTokenSymbol(bankLabel);
    if (!bank) throw new Error(`${bankLabel} bank not found`);
    await marginfiAccount.deposit(0.01, bank.address);
    console.log('Deposit successful');
    
    // Borrow (borrow less than what is lended)
    await marginfiAccount.borrow(0.001, bank.address);
    console.log('Borrow successful');

    await wallet.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();