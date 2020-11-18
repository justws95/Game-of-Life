import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import GameScene from '../../phaser/GameScene';


class PhaserGame extends Component {
  state = {
    initialize: true,
    game: {
      width: this.props.width,
      height: this.props.height,
      type: Phaser.AUTO,
      scene: new GameScene(
        this.props.gameRows, 
        this.props.gameCols, 
        this.props.startingCells, 
        this.props.width, 
        this.props.height)
    }
  }

  render() {
    const { initialize, game } = this.state;
    return (
      <IonPhaser game={game} initialize={initialize} />
    );
  }
}

export default PhaserGame;
