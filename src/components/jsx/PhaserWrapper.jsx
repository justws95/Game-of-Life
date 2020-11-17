import React, { useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import playGame from '../../phaser/scene';


const config = {
	type: Phaser.AUTO,
	parent: "phaser",
	width: 960,
	height: 640,
	scene: playGame
};
  
const game = new Phaser.Game(config);

function PhaserWrapper() {
	const [initialize, setInitilize] = useState(true);

	return (
		<React.Fragment>
			<IonPhaser game={game} initialize={initialize} />
		</React.Fragment>
	);
}

export default PhaserWrapper;
