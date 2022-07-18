import React from 'react';
import IMG1 from '../../assets/pokedex.png';
import IMG2 from '../../assets/springstorm.png';
import IMG3 from '../../assets/expensemanager.png';
// import IMG4 from '../../assets/portfolio.png';
import IMG5 from '../../assets/colorrandom.png';
import IMG6 from '../../assets/tictactoe.png';

import './portfolio.css';

const Portfolio = () => {
  const soloProjects = [
    {
      id: 1,
      title: 'Pokedex',
      img: IMG1,
      link: 'https://dhawal-pandya.github.io/Pokedex/',
      github: 'https://github.com/dhawal-pandya/Pokedex',
    },
    {
      id: 2,
      title: 'SpringStorm',
      img: IMG2,
      link: 'https://dhawal-pandya.github.io/SpringStorm/',
      github: 'https://github.com/dhawal-pandya/SpringStorm',
    },
    {
      id: 3,
      title: 'Expense-Manager',
      img: IMG3,
      link: 'https://dhawal-pandya.github.io/Expense-Manager/',
      github: 'https://github.com/dhawal-pandya/Expense-Manager',
    },
    // {
    //   id: 4,
    //   title: 'Shelter',
    // img: IMG3,
    //   link: 'https://meri-mg.github.io/shelter/pages/main/index.html',
    //   github: 'https://github.com/Meri-MG/shelter',
    // },
    {
      id: 5,
      title: 'Color Randomiser',
      img: IMG5,
      link: 'https://dhawal-pandya.github.io/Color-Randomiser-Name/',
      github: 'https://github.com/dhawal-pandya/Color-Randomiser-Name',
    },
    {
      id: 6,
      title: 'Tic-Tac-Toe',
      img: IMG6,
      link: 'https://dhawal-pandya.github.io/Tic-Tac-Toe/',
      github: 'https://github.com/dhawal-pandya/Tic-Tac-Toe',
    },
  ];

  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className='container portfolio__container'>
        {soloProjects.map((pro) => (
          <article className='portfolio__item' key={pro.id}>
            <div className='portfolio__item-image'>
              <img src={pro.img} alt={pro.title} />
            </div>
            <h3>{pro.title}</h3>
            <div className='portfolio__item-cta'>
              <a href={pro.github} className='btn'>
                GitHub
              </a>
              <a href={pro.link} className='btn btn-primary'>
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
