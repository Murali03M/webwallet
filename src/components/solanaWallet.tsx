import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from './ui/button';
import axios from 'axios';

interface BalanceState {
  [index: number]: number;
}

interface SolanaWalletProps {
  seed: Buffer;  
}


const SolanaWallet = ({ seed }:SolanaWalletProps) => {
  const [index, setIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [balances, setBalances] = useState<BalanceState>({});

  const generateWallet = () => {
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setIndex(index + 1);
    setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]); // Convert PublicKey to string
  };

  const showBalance = async (key: string, idx: number) => {
    try {
      const response = await axios.post(
        "https://mainnet.helius-rpc.com/?api-key=bbba508a-8a83-457b-b652-6ccb8fe1775f",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [key, { commitment: "finalized" }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setBalances((prevBalances) => ({
        ...prevBalances,
        [idx]: response.data.result.value,
      }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const removeWallet = (idxToRemove: number) => {
    setPublicKeys(publicKeys.filter((_, idx) => idx !== idxToRemove));
    setBalances((prevBalances) => {
      const newBalances = { ...prevBalances };
      delete newBalances[idxToRemove];
      return newBalances;
    });
  };

  return (
    <div className="mt-10">
      <div className='font-bold text-3xl text-center mb-6'>Solana Wallet</div>
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
                Balance: {balances[idx]} lamports
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolanaWallet;

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
