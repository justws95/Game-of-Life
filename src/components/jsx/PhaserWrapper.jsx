import React, { useState, Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import playGame from '../../phaser/scene';

/*
const config = {
	type: Phaser.AUTO,
	parent: "phaser",
	width: 960,
	height: 640,
	scene: playGame
};
  
const game = new Phaser.Game(config);

function PhaserWrapper() {
	return (
		<React.Fragment>
			<IonPhaser game={game} initialize={true} />
		</React.Fragment>
	);
}*/

class PhaserWrapper extends Component {

  state = {
    initialize: true,
    game: {
      width: "75%",
      height: "75%",
      type: Phaser.AUTO,
      scene: {
        init: function() {
          this.startingCells = 0;
          this.livingCells = this.startingCells;
          this.currentIteration = 0;
        },
        create: function() {
          /*
          this.helloWorld = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            "Hello World", { 
              font: "40px Arial", 
              fill: "#ffffff" 
            }
          );
          this.helloWorld.setOrigin(0.5);
          */
         
        },
        update: function() {
          this.helloWorld.angle += 1;
        }
      }
    }
  }

  render() {
    const { initialize, game } = this.state
    return (
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

export default PhaserWrapper;
