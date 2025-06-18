import React, { useState } from "react";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BiBook, BiMessageSquareDetail } from "react-icons/bi";
import { RiServiceLine } from "react-icons/ri";

const Topbar = () => {
  const [activeNav, setActiveNav] = useState("#home");

  const navLinks = [
    { href: "#home", icon: <AiOutlineHome /> },
    { href: "#about", icon: <AiOutlineUser /> },
    { href: "#experience", icon: <BiBook /> },
    { href: "#portfolio", icon: <RiServiceLine /> },
    { href: "#contact", icon: <BiMessageSquareDetail /> },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 z-10 block w-max -translate-x-1/2 transform rounded-full bg-black bg-opacity-30 p-3 backdrop-blur-md">
      <div className="flex gap-3">
        {navLinks.map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            onClick={() => setActiveNav(href)}
            className={`flex rounded-full bg-transparent p-4 text-lg text-gray-300 hover:bg-black hover:bg-opacity-30 ${
              activeNav === href ? "bg-gray-900 text-white" : ""
            }`}
          >
            {icon}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Topbar;
