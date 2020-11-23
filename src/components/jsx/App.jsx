import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppMenu from './AppMenu';
import AboutPage from './AboutPage';
import GamePage from './GamePage';

//import '../css/App.css';


function App() {
  return (
    <Router>
      <AppMenu />
      <Switch>
        <Route exact path="/" component={ GamePage } />
        <Route path="/about" component={ AboutPage } />
      </Switch>
    </Router>
  );
}

export default App;
