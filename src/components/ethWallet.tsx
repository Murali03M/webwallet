import { useState } from "react";
import { Wallet, HDNodeWallet } from "ethers";
import { Button } from './ui/button';
import { ethers } from 'ethers';

interface BalanceState {
  [index: number]: number | string;
}

interface SolanaWalletProps {
  seed: Buffer ;  
}


const EthWallet = ({ seed }:SolanaWalletProps) => {
  const [index, setIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [balances, setBalances] = useState<BalanceState>({});
  const generateWallet = () => {
    try {
      const derivationPath = `m/44'/60'/${index}'/0/0`; 
      const hdNode = HDNodeWallet.fromSeed(seed);        
      const child = hdNode.derivePath(derivationPath);
      const wallet = new Wallet(child.privateKey);

      setIndex(index + 1);
      setPublicKeys([...publicKeys, wallet.address]);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  const removeWallet = (idxToRemove:number) => {
    setPublicKeys(publicKeys.filter((_, idx) => idx !== idxToRemove));
  };

  const showBalance = async (key: ethers.AddressLike, idx: number) => {
    try {
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/0e339e6732e14936a03e3b07e9fa216d');
      const balanceWei = await provider.getBalance(key);
      const balanceEth = ethers.formatEther(balanceWei); // Convert balance to Ether

      setBalances((prevBalances) => ({
        ...prevBalances,
        [idx]: balanceEth,
      }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div className="mt-10">
      <div className='font-bold text-3xl text-center mb-6'>Ethereum Wallet</div>
      <div className="flex justify-center m-3">
        <Button onClick={generateWallet}>Add Wallet</Button>
      </div>
      <div className="space-y-4 max-w-lg mx-auto mt-2">
        {publicKeys.map((key, idx) => (
          <div key={idx} className="border p-4 rounded-lg shadow-md items-center">
            <div className="text-lg font-semibold">Wallet {idx + 1}</div>
            <div className="ml-4 flex justify-between gap-2">
              <p className="text-md">Public Key: {key}</p>
              <div
                className="cursor-pointer"
                onClick={() => removeWallet(idx)}
              >
                <Trash />
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <Button onClick={() => showBalance(key, idx)}>Show Balance</Button>
            </div>
            {balances[idx] !== undefined && (
              <div className="mt-2 text-center">
                Balance: {balances[idx]} ETH
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthWallet;

const Trash = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-600 hover:text-red-600 transition-colors duration-200"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
};
