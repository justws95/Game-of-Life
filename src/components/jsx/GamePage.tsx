import React, { useState, useEffect } from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { Grid, Menu, Dropdown, Header } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';

import getConfig from '../../phaser/game';

import logo from '../../assets/logo.png';


const gameConfig: GameInstance = getConfig(900, 600);


function GamePage () {
  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState(false);
  const [disableInputs, setInputState] = useState(false);

  const destroy = () => {
    console.log('Instance', game?.instance)
    setInitialize(false)
    setGame(undefined)
  }

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig));
      setInputState(true);
    }
    else {
      setInputState(false);
    }
  }, [initialize])

  return (
    <Grid stretched>
      <Grid.Row stretched>
        <Grid.Column stretched width={3}>
          <Menu vertical inverted size='large'>
            <Menu.Item disabled={disableInputs}>
              <p>This is a menu item</p>
            </Menu.Item>
            <Menu.Item disabled={disableInputs}>
              <p>This is also a menu item</p>
            </Menu.Item>
            <Menu.Item>
              <ChromePicker />
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <div className="App">
            <header className="App-header">
              { initialize ? (
                <React.Fragment>
                  <IonPhaser game={game} initialize={initialize} />
                  <div onClick={destroy} className="flex destroyButton">
                    <a href="#1" className="bttn">Destroy</a>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <img src={logo} className="App-logo" alt="logo" />
                  <div onClick={() => setInitialize(true)} className="flex">
                    <a href="#1" className="bttn">Initialize</a>
                  </div>
                </React.Fragment>
              )}
            </header>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default GamePage;
