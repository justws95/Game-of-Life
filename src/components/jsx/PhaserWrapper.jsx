import React, { useState } from 'react';
import Phaser from "phaser";
import { IonPhaser } from '@ion-phaser/react';

import getConfig from '../../phaser/game';


class PhaserWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.game = null;
		this.gameConfig = getConfig();
	}

	componentDidMount() {
		if (this.game === null) { 
			console.log("Going to try to create a new game.");
			console.log("I will use the following config: ", this.gameConfig);
			this.game = new Phaser.Game(this.gameConfig);
		}
	}

	componentWillUnmount() {
		if (this.game != null) {
			this.game.destroy(true);
		}
	}

	render() {
		return (
			<React.Fragment>
				<IonPhaser game={this.game} initialize={true} />
			</React.Fragment>
		);
	}
}

export default PhaserWrapper;
