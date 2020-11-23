import React from 'react';
import Phaser from "phaser";
import { IonPhaser } from '@ion-phaser/react';

import getConfig from '../../phaser/game';

import '../css/PhaserWrapper.css';


class PhaserWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.game = null;
		this.gameConfig = getConfig(props.width, props.height);
	}

	componentDidMount() {
		if (this.game === null) {
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
