import React from 'react';
import Contact from './components/contact/Contact';
import Experience from './components/experience/Experience';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Intro from './components/intro/Intro';
import Portfolio from './components/portfolio/Portfolio';
import Kanban from './components/kanban/Kanban';
import Topbar from './components/topbar/Topbar';
import Cursor from './components/cursor/Cursor';

import { Provider } from 'react-redux';
import store from './components/kanban/Utils/store';

const App = () => {
  return (
    <>
      <Cursor />
      <Header />
      <Topbar />
      <Intro />
      <Experience />
      <Portfolio />
      <Provider store={store}>
        <Kanban />
      </Provider>
      <Contact />
      <Footer />
    </>
  );
};

export default App;
