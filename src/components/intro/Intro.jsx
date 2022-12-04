import React from 'react';
// import { FaAward } from 'react-icons/fa';
import { VscFolderLibrary } from 'react-icons/vsc';
import ME from '../../assets/me.png';
import './intro.css';

const Intro = () => {
  return (
    <section id='about'>
      <h5>Get to know</h5>
      <h2>About Me</h2>
      <div className='container about__container'>
        <div className='about__me'>
          <div className='about__me-image'>
            <img src={ME} alt='me' />
          </div>
        </div>
        <div className='about__content'>
          <div className='about__cards'>
            {/* <article className='about__card'>
              <FaAward className='about__icon' />
              <h5>Certificates</h5>
              <small></small>
            </article> */}
            <div>
              <a href='#portfolio'>
                <article className='about__card'>
                  <VscFolderLibrary className='about__icon' />
                  <h5>Projects</h5>
                  <small>6 Completed Projects</small>
                </article>
              </a>
            </div>
          </div>
          <p>
            I am Dhawal.
            <br /> I solve problems, by learning as deeply about something
            needed to solve that problem. <br />I pride on my work, which
            instills an optimal amount of watchfulness in every piece of
            software that I code. <br />I may lack experience, but I more than
            make up for it with my hunger for knowledge. <br />I have got a 5 ⭐
            <a href='https://www.hackerrank.com/dhawalpandya'> Gold Badge </a>
            from HackerRank for Problem-Solving.
            <br />
            Click on the button below to have a conversation with me.
          </p>
          <a href='#contact' className='btn btn-primary'>
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default Intro;
