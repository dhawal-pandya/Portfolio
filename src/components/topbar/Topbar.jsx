import React, { useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineUser } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { RiServiceLine } from 'react-icons/ri';
import { BiMessageSquareDetail } from 'react-icons/bi';

const Topbar = () => {
  const [activeNav, setActiveNav] = useState('#home');
  return (
    <nav className="bg-black/30 w-max fixed left-1/2 -translate-x-1/2 bottom-8 flex gap-[0.8rem] py-[0.7rem] px-[1.7rem] z-[2] rounded-[3rem] backdrop-blur-[7px]">
      <a
        href='#home'
        onClick={() => setActiveNav('#home')}
        className={`p-[0.9rem] rounded-full flex text-[1.1rem] hover:bg-black/30 ${activeNav === '#home' ? 'bg-bg text-white' : 'bg-transparent text-light'}`}
      >
        <AiOutlineHome />
      </a>
      <a
        href='#about'
        onClick={() => setActiveNav('#about')}
        className={`p-[0.9rem] rounded-full flex text-[1.1rem] hover:bg-black/30 ${activeNav === '#about' ? 'bg-bg text-white' : 'bg-transparent text-light'}`}
      >
        <AiOutlineUser />
      </a>
      <a
        href='#experience'
        onClick={() => setActiveNav('#experience')}
        className={`p-[0.9rem] rounded-full flex text-[1.1rem] hover:bg-black/30 ${activeNav === '#experience' ? 'bg-bg text-white' : 'bg-transparent text-light'}`}
      >
        <BiBook />
      </a>
      <a
        href='#portfolio'
        onClick={() => setActiveNav('#portfolio')}
        className={`p-[0.9rem] rounded-full flex text-[1.1rem] hover:bg-black/30 ${activeNav === '#portfolio' ? 'bg-bg text-white' : 'bg-transparent text-light'}`}
      >
        <RiServiceLine />
      </a>
      <a
        href='#contact'
        onClick={() => setActiveNav('#contact')}
        className={`p-[0.9rem] rounded-full flex text-[1.1rem] hover:bg-black/30 ${activeNav === '#contact' ? 'bg-bg text-white' : 'bg-transparent text-light'}`}
      >
        <BiMessageSquareDetail />
      </a>
    </nav>
  );
};

export default Topbar;
