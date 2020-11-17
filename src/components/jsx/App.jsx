import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppMenu from './AppMenu';
import PhaserWrapper from './PhaserWrapper';
import AboutPage from './AboutPage';


//import '../css/App.css';


function App() {
  return (
    <Router>
      <AppMenu />
      <Switch>
        <Route exact path="/" component={ PhaserWrapper } />
        <Route path="/about" component={ AboutPage } />
      </Switch>
    </Router>
  );
}

export default App;
