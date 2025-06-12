import React from 'react';

import { BsLinkedin } from 'react-icons/bs';
import { FaGithub, FaTwitter } from 'react-icons/fa';

import IMG1 from '../../assets/footer.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary to-bg-variant/60 text-center text-[0.9rem] mt-28">
      <a href='#home' className="text-4xl font-medium mb-8 p-4 inline-block text-bg">
        Dhawal Pandya
      </a>
      <ul className="flex flex-wrap justify-center gap-8 mx-auto mb-8 max-[600px]:flex-col max-[600px]:gap-6">
        <li>
          <a href='#home' className="text-bg">Home</a>
        </li>
        <li>
          <a href='#about' className="text-bg">About</a>
        </li>
        <li>
          <a href='#experience' className="text-bg">Skills</a>
        </li>
        <li>
          <a href='#portfolio' className="text-bg">Portfolio</a>
        </li>
        <li>
          <a href='#contact' className="text-bg">Contact</a>
        </li>
      </ul>
      <div className="flex justify-center gap-4 mb-4 max-[600px]:mb-[2.6rem]">
        <a
          href='https://www.linkedin.com/in/dhawal-pandya/'
          target='_blank'
          rel='noreferrer'
          className="bg-bg text-white p-[0.8rem] rounded-[0.7rem] flex border border-transparent hover:bg-transparent hover:text-bg hover:border-bg"
        >
          <BsLinkedin />
        </a>
        <a
          href='https://github.com/dhawal-pandya'
          target='_blank'
          rel='noreferrer'
          className="bg-bg text-white p-[0.8rem] rounded-[0.7rem] flex border border-transparent hover:bg-transparent hover:text-bg hover:border-bg"
        >
          <FaGithub />
        </a>
        <a
          href='https://twitter.com/pandya_dhawal'
          target='_blank'
          rel='noreferrer'
          className="bg-bg text-white p-[0.8rem] rounded-[0.7rem] flex border border-transparent hover:bg-transparent hover:text-bg hover:border-bg"
        >
          <FaTwitter />
        </a>
      </div>
      <div className="mb-4 text-bg">
        <small>Made with ❤️ by Dhawal Pandya</small>
      </div>
      <div className='footimg'>
        <img src={IMG1} alt='footerimage' className="relative w-[70%] left-[15%]" />
      </div>
    </footer>
  );
};

export default Footer;
