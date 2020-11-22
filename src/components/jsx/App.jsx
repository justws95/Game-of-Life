import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppMenu from './AppMenu';
import AboutPage from './AboutPage';
import PhaserWrapper from './PhaserWrapper';

//import '../css/App.css';


function App() {
  return (
    <Router>
      <AppMenu />
      <Switch>
        <Route exact path="/">
          <PhaserWrapper
            gameRows={10} 
            gameCols={10} 
            startingCells={20} 
            width={800} 
            height={600} 
          />
        </Route> 
        <Route path="/about" component={ AboutPage } />
      </Switch>
    </Router>
  );
}

export default App;
