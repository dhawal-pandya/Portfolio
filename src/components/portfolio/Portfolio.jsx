import React from 'react';
import IMG1 from '../../assets/GOL.png';
import IMG2 from '../../assets/sudoku.png';
import IMG3 from '../../assets/pokedex.png';
import IMG4 from '../../assets/springstorm.png';
import IMG5 from '../../assets/postit.png';
import IMG6 from '../../assets/tictactoe.png';
import IMG7 from '../../assets/colorrandom.png';
// import IMG7 from '../../assets/expensemanager.png';

import './portfolio.css';

const Portfolio = () => {
  const soloProjects = [
    {
      id: 1,
      title: 'Game Of Life',
      img: IMG1,
      link: 'https://dhawal-pandya.github.io/Game-Of-Life/',
      github: 'https://github.com/dhawal-pandya/Game-Of-Life',
    },
    {
      id: 2,
      title: 'Sudoku Solver',
      img: IMG2,
      link: 'https://dhawal-pandya.github.io/Sudoku-Solver/',
      github: 'https://github.com/dhawal-pandya/Sudoku-Solver',
    },
    {
      id: 3,
      title: 'Pokedex',
      img: IMG3,
      link: 'https://dhawal-pandya.github.io/Pokedex/',
      github: 'https://github.com/dhawal-pandya/Pokedex',
    },
    {
      id: 4,
      title: 'SpringStorm',
      img: IMG4,
      link: 'https://dhawal-pandya.github.io/SpringStorm/',
      github: 'https://github.com/dhawal-pandya/SpringStorm',
    },
    {
      id: 5,
      title: 'PostIt',
      img: IMG5,
      link: 'https://dhawal-pandya.github.io/PostIt/',
      github: 'https://github.com/dhawal-pandya/PostIt',
    },
    {
      id: 6,
      title: 'Tic-Tac-Toe',
      img: IMG6,
      link: 'https://dhawal-pandya.github.io/Tic-Tac-Toe/',
      github: 'https://github.com/dhawal-pandya/Tic-Tac-Toe',
    },
    {
      id: 7,
      title: 'Color Randomiser',
      img: IMG7,
      link: 'https://dhawal-pandya.github.io/Color-Randomiser-Name/',
      github: 'https://github.com/dhawal-pandya/Color-Randomiser-Name',
    },
    // {
    //   id: 7,
    //   title: 'Expense-Manager',
    //   img: IMG7,
    //   link: 'https://dhawal-pandya.github.io/Expense-Manager/',
    //   github: 'https://github.com/dhawal-pandya/Expense-Manager',
    // },
  ];

  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className='container portfolio__container'>
        {soloProjects.map((proj) => (
          <article className='portfolio__item' key={proj.id}>
            <div className='portfolio__item-image'>
              <img src={proj.img} alt={proj.title} />
            </div>
            <h3>{proj.title}</h3>
            <div className='portfolio__item-cta'>
              <a
                href={proj.github}
                target='_blank'
                rel='noreferrer'
                className='btn'
              >
                GitHub
              </a>
              <a
                href={proj.link}
                target='_blank'
                rel='noreferrer'
                className='btn btn-primary'
              >
                Demo
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
