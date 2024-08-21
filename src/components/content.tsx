import React, { useState } from 'react';
import { Button } from './ui/button';
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Buffer } from 'buffer';
import SolanaWallet from './solanaWallet'; // Import the SolanaWallet component
import EthWallet from './ethWallet';

window.Buffer = window.Buffer || Buffer;

const Content = () => {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [seed, setSeed] = useState<Buffer>();


  const generatePhrase = () => {
    const mn = generateMnemonic(); 
    const phraseArray = mn.split(" ");
    const sd: Buffer = mnemonicToSeedSync(mn) || ""; 
    setSeed(sd);
    setMnemonic(phraseArray);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <div className='font-bold text-3xl mb-4 text-center'>Web Based Wallet</div>
      <div className='font-light text-lg mb-8 text-center'>Create or add the wallet using seed phrase</div>
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        {mnemonic.length === 0 && (
          <Button type="button" onClick={generatePhrase}>
            Generate Phrase
          </Button>
        )}

        {mnemonic.length > 0 && (
          <div className="text-center">
            <p className="mb-4 font-bold">Generated Mnemonic:</p>
            <div className="grid grid-cols-4 gap-2">
              {mnemonic.map((word, index) => (
                <span key={index} className="bg-slate-900 rounded p-4 border m-2  ">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='m-2'>
    {mnemonic.length > 0 && seed && (
    <div className='grid grid-flow-col grid-cols-2 w-full gap-10'>
      <SolanaWallet seed={seed} />
      <EthWallet seed={seed} />
    </div>
  )}
</div>

      
    </div>
  );
};

export default Content;
