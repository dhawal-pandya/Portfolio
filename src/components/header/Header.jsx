import React from 'react';
import CTA from './CTA';
// import HeaderSocials from './HeaderSocials';
import './header.css';

const Header = () => {
  return (
    <header id='home'>
      <div className='container header__container'>
        <h5 className='top'>Hello I'm</h5>
        <h1>Dhawal Pandya</h1>
        <h5 className='text-light top'>Software Developer</h5>
        <CTA />
        {/* <a href='#contact' className='scroll__on'>
          Scroll On...
        </a> */}
        {/* <HeaderSocials /> */}
      </div>
    </header>
  );
};

export default Header;
