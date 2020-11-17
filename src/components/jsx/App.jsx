import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import playGame from '../../phaser/scene';

//import '../css/App.css';

const config = {
	type: Phaser.AUTO,
	parent: "phaser",
	width: 960,
	height: 640,
	scene: playGame
};
  
const _game = new Phaser.Game(config);


class App extends Component {

  state = {
    initialize: true,
    game: _game
  }

  render() {
    const { initialize, game } = this.state
    return (
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

export default App;
