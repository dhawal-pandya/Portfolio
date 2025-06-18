import React from "react";

import { BsLinkedin } from "react-icons/bs";
import { FaGithub, FaTwitter } from "react-icons/fa";

import IMG1 from "../../assets/footer.png";

const Footer = () => {
  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/dhawal-pandya/",
      icon: <BsLinkedin />,
    },
    { href: "https://github.com/dhawal-pandya", icon: <FaGithub /> },
    { href: "https://twitter.com/pandya_dhawal", icon: <FaTwitter /> },
  ];

  const permalinks = [
    { href: "#home", title: "Home" },
    { href: "#about", title: "About" },
    { href: "#experience", title: "Skills" },
    { href: "#portfolio", title: "Portfolio" },
    { href: "#contact", title: "Contact" },
  ];

  return (
    <footer className="mt-28 bg-gradient-to-b from-[#5fb8f8] to-[#2c2c6c97] text-center text-sm">
      <a
        href="#home"
        className="mb-8 inline-block p-4 text-3xl font-medium text-[#18182d]"
      >
        Dhawal Pandya
      </a>
      <ul className="mx-auto mb-8 flex flex-wrap justify-center gap-8 sm:gap-4 md:flex-row md:gap-8">
        {permalinks.map(({ href, title }) => (
          <li key={href}>
            <a href={href} className="text-[#18182d]">
              {title}
            </a>
          </li>
        ))}
      </ul>
      <div className="mb-4 flex justify-center gap-4">
        {socialLinks.map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex rounded-lg border border-transparent bg-[#18182d] p-3 text-white hover:border-[#18182d] hover:bg-transparent hover:text-[#18182d]"
          >
            {icon}
          </a>
        ))}
      </div>
      <div className="mb-4 text-[#18182d]">
        <small>Made with ❤️ by Dhawal Pandya</small>
      </div>
      <div className="relative mx-auto w-3/4 sm:w-1/2">
        <img src={IMG1} alt="footerimage" />
      </div>
    </footer>
  );
};

export default Footer;
