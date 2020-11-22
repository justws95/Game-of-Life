import React, { useState } from 'react';
import { IonPhaser } from '@ion-phaser/react';

import game from '../../phaser/game';


function PhaserWrapper(props) {
	return (
		<React.Fragment>
			<IonPhaser game={game} initialize={false} />
		</React.Fragment>
	);
}

export default PhaserWrapper;
