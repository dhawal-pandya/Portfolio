import React from 'react';
import IMG1 from '../../assets/GOL.png';
import IMG2 from '../../assets/neatrace.jpg';
import IMG3 from '../../assets/Asteroids.png';
import IMG4 from '../../assets/QR.png';
import IMG5 from '../../assets/murl.png';
import IMG6 from '../../assets/pokedex.png';
import IMG7 from '../../assets/fynd.png';
import IMG8 from '../../assets/springstorm.png';
import IMG9 from '../../assets/sudoku.png';
import IMG10 from '../../assets/diff-checker.png';
import IMG11 from '../../assets/num-convertor.png';
import IMG12 from '../../assets/more.png';

import './portfolio.css';

const Portfolio = () => {
  const soloProjects = [
    {
      id: 1,
      title: 'Game Of Life',
      img: IMG1,
      link: 'https://dhawal-pandya.github.io/Game-Of-Life/',
      github: 'https://github.com/dhawal-pandya/Game-Of-Life',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 2,
      title: 'NeatTrace',
      img: IMG2,
      github: 'https://github.com/dhawal-pandya/NeatTrace',
      language: ['Golang', 'Rust'],
    },
    {
      id: 3,
      title: 'Asteroids',
      img: IMG3,
      github: 'https://github.com/dhawal-pandya/Asteroids',
      language: ['Golang', 'Ebiten (Game Engine)'],
    },
    {
      id: 4,
      title: 'QRCode Generator',
      img: IMG4,
      github: 'https://github.com/dhawal-pandya/qrcode-generator-decoder',
      language: ['Golang'],
    },
    {
      id: 5,
      title: 'Murl',
      img: IMG5,
      github: 'https://github.com/dhawal-pandya/Murl',
      language: ['Golang'],
    },
    {
      id: 6,
      title: 'Pokedex',
      img: IMG6,
      link: 'https://dhawal-pandya.github.io/Pokedex/',
      github: 'https://github.com/dhawal-pandya/Pokedex',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 7,
      title: 'Fynd',
      img: IMG7,
      github: 'https://github.com/dhawal-pandya/Fynd',
      language: ['Golang'],
    },
    {
      id: 8,
      title: 'SpringStorm',
      img: IMG8,
      link: 'https://dhawal-pandya.github.io/SpringStorm/',
      github: 'https://github.com/dhawal-pandya/SpringStorm',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 9,
      title: 'Sudoku-Solver',
      img: IMG9,
      link: 'https://dhawal-pandya.github.io/Sudoku-Solver/',
      github: 'https://github.com/dhawal-pandya/Sudoku-Solver',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 10,
      title: 'Diff-Checker',
      img: IMG10,
      link: 'https://dhawal-pandya.github.io/Diff-Checker/',
      github: 'https://github.com/dhawal-pandya/Diff-Checker',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 11,
      title: 'Number-Convertor',
      img: IMG11,
      link: 'https://dhawal-pandya.github.io/Number-Convertor/',
      github: 'https://github.com/dhawal-pandya/Number-Convertor',
      language: ['JavaScript (React)', 'TailwindCSS'],
    },
    {
      id: 12,
      img: IMG12,
      language: ['And so many more...'],
    },
  ];
  

  return (
    <section id='portfolio'>
      <h5>My recent work is this</h5>
      <h2>Portfolio</h2>

      <div className='container portfolio__container'>
        {soloProjects.map((proj) => (
          <article className='portfolio__item' key={proj.id}>
            <div className='portfolio__item-image'>
              <img src={proj.img} alt={proj.title} />
            </div>
          <div className='portfolio__item-info'>
            <h3>{proj.title}</h3>
            { proj.language ? <h4 className='portfolio__languages'>
              {proj.language.join(', ')}
            </h4> :null}
            <div className='portfolio__item-cta'>
             {proj.github? <a
                href={proj.github}
                target='_blank'
                rel='noreferrer'
                className='btn'
                >
                Code
              </a>:null}
              { proj.link ? <a
                href={proj.link}
                target='_blank'
                rel='noreferrer'
                className='btn btn-primary'
                >
                Demo
              </a> : null}
            </div>
                </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
