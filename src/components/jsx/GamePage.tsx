import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { 
  Grid, 
  Menu, 
  Image, 
  Container, 
  Header,
  Radio,
  Dropdown,
  Button } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import getConfig from '../../phaser/game';

import splashScreenGif from '../../assets/splash-screen.gif';





function GamePage () {
  const screenSizeArr = [
    [400, 300],
    [500, 400],
    [800, 600],
    [1000, 800],
    [1200, 1000],
  ]

  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState<boolean>(false);
  const [disableInputs, setInputState] = useState<boolean>(false);
  const [backGroundColor, setBackColor] = useState<string>('0x646464');
  const [foreGroundColor, setForeColor] = useState<string>('0x05f7a7');
  const [gridSize, setGridSize] = useState<number[]>(screenSizeArr[2]);
  const [updateFreq, setUpdateFreq] = useState<number>(60);

  const gameConfig: GameInstance = getConfig(gridSize[0], gridSize[1]);

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

  
  const screenSizeOptions = [
    {
      key: '400 x 300',
      text: '400 x 300',
      value: 0
    },
    {
      key: '500 x 400',
      text: '500 x 400',
      value: 1
    },
    {
      key: '800 x 600',
      text: '800 x 600',
      value: 2
    },
    {
      key: '1000 x 800',
      text: '1000 x 800',
      value: 3
    },
    {
      key: '1200 x 1000',
      text: '1200 x 1000',
      value: 4
    }
  ]

  return (
    <Grid stretched>
      <Grid.Row stretched>
        <Grid.Column stretched width={3}>
          <Menu vertical size='large'>
            <Menu.Item disabled={disableInputs}>
            <Dropdown
              placeholder='width x height'
              fluid
              selection
              options={screenSizeOptions}
              disabled={disableInputs}
              value={screenSizeArr[2]}
              onChange={ e => {
                console.log(e);
              }}
            />
            </Menu.Item>
            <Menu.Item disabled={disableInputs}>
              <Radio toggle label='Wrap Grid' defaultChecked disabled={disableInputs} />
            </Menu.Item>
            <Menu.Item>


              <Slider 
                min={1}
                max={10}
              />


            </Menu.Item>


            {!(disableInputs) &&
              <React.Fragment>
              <Menu.Item>
                <Header content="Grid Color" />
                <SliderPicker 
                  color={backGroundColor}
                  onChangeComplete={ color => {
                    setBackColor(color.hex);
                  }}
                />
              </Menu.Item>
              <Menu.Item>
                <Header content="Cell Color" />
                <SliderPicker 
                  color={foreGroundColor}
                  onChangeComplete={ color => {
                    setForeColor(color.hex);
                    console.log("I'm gonna set the forGroundColor to: ", color.hex);
                  }}
                />
              </Menu.Item>
              </React.Fragment>
            }
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
