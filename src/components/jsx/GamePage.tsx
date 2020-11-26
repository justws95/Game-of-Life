import React, { useState, useEffect } from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { Grid, Menu, Image, Container, Header, Button } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import getConfig from '../../phaser/game';

import splashScreenGif from '../../assets/splash-screen.gif';


const gameConfig: GameInstance = getConfig(900, 600);


function GamePage () {
  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState(false);
  const [disableInputs, setInputState] = useState(false);
  const [backGroundColor, setBackColor] = useState('0x646464');
  const [foreGroundColor, setForeColor] = useState('0x05f7a7');

  const destroy = () => {
    console.log('Instance', game?.instance)
    setInitialize(false);
    setGame(undefined);
  }

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig));
      setInputState(true);
    }
    else {
      setInputState(false);
    }
  }, [initialize]);

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
              <Header content="Grid Color" inverted/>
              <SliderPicker 
                color={backGroundColor}
                onChangeComplete={ color => {
                  setBackColor(color.hex);
                }}
              />
            </Menu.Item>
            <Menu.Item>
              <Header content="Cell Color" inverted/>
              <SliderPicker 
                color={foreGroundColor}
                onChangeComplete={ color => {
                  setForeColor(color.hex);
                  console.log("I'm gonna set the forGroundColor to: ", color.hex);
                }}
              />
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12} textAlign='center'>
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
                  <Container textAlign='justified'>
                    <Image src={splashScreenGif} size='massive' bordered />
                    <Button 
                      fluid 
                      content="Start Simulation"
                      onClick={click => {
                        setInitialize(true);
                      }} 
                    />
                  </Container>
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
