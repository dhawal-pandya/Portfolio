import React from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const HeaderSocials = () => {
  return (
    <div className='header__socials'>
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
  );
};

export default HeaderSocials;
