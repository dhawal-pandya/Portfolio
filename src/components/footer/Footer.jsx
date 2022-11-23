import React from 'react';

import { BsLinkedin } from 'react-icons/bs';
import { FaGithub, FaTwitter } from 'react-icons/fa';

import './footer.css';

import IMG1 from '../../assets/footer.png';

const Footer = () => {
  return (
    <footer>
      <a href='#home' className='footer__logo'>
        Dhawal Pandya
      </a>
      <ul className='permalinks'>
        <li>
          <a href='#home'>Home</a>
        </li>
        <li>
          <a href='#about'>About</a>
        </li>
        <li>
          <a href='#experience'>Skills</a>
        </li>
        <li>
          <a href='#portfolio'>Portfolio</a>
        </li>
        <li>
          <a href='#contact'>Contact</a>
        </li>
      </ul>
      <div className='footer__socials'>
        <a
          href='https://www.linkedin.com/in/dhawal-pandya/'
          target='_blank'
          rel='noreferrer'
        >
          <BsLinkedin />
        </a>
        <a
          href='https://github.com/dhawal-pandya'
          target='_blank'
          rel='noreferrer'
        >
          <FaGithub />
        </a>
        <a
          href='https://twitter.com/pandya_dhawal'
          target='_blank'
          rel='noreferrer'
        >
          <FaTwitter />
        </a>
      </div>
      <div className='msg'>
        <small>Made with ❤️ by Dhawal Pandya</small>
      </div>
      <div className='footimg'>
        <img src={IMG1} alt='footerimage' />
      </div>
    </footer>
  );
};

export default Footer;
