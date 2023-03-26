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
                  <small>9+ Completed Projects</small>
                </article>
              </a>
            </div>
          </div>
          <p>
            Hello, I am Dhawal, a tech-savvy problem solver who approaches
            challenges with an insatiable hunger for knowledge.
            <br />
            <br />
            My approach to problem-solving involves delving deeply into the
            intricacies of the issue at hand, ensuring that I am equipped with
            the tools and expertise needed to devise a successful solution.
            <br />
            <br />
            One aspect of my work that I take immense pride in is my attention
            to detail. Every line of code that I write is imbued with a level of
            watchfulness that ensures optimal functionality and performance.
            <br />
            <br />
            While I may be relatively new to the industry, I have already
            achieved significant recognition for my problem-solving skills.
            <br />
            <br />
            I have been awarded a 5 ⭐ Gold Badge from HackerRank, attesting to
            my prowess in tackling complex coding challenges.
            <br />
            <br />
            So, if you're seeking a knowledgeable, detail-oriented, and
            ambitious tech professional to collaborate with on your next
            project, I invite you to click on the button below and start a
            conversation with me.
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
