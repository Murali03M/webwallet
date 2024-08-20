import React from 'react';
import { ModeToggle } from './mode-toggle';

const Header = () => {
  return (
    <div className="flex justify-between items-center border-b px-72 py-5">
      <div className="flex items-center">
        <span className="text-2xl font-semibold">Wallet <span className="text-sm ml-2"></span></span>
      </div>
      <div className="flex items-center">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
