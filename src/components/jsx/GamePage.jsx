import React from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { Grid, Menu, Dropdown, Header } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';

import PhaserWrapper from './PhaserWrapper';


function GamePage(props) {
  return (
    <div className='game-page-container'>
      <Menu
        vertical
        size='large'
        className='game-page-menu'
      >
      <Menu.Item>
        <Dropdown item text='Game Grid Size'>
          <Dropdown.Menu>
            <Dropdown.Item>Electronics</Dropdown.Item>
            <Dropdown.Item>Automotive</Dropdown.Item>
            <Dropdown.Item>Home</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Item>
        <br />
        <br/>
        <Menu.Item>
          <Header content={"Grid Color"} />
          <ChromePicker />
        </Menu.Item>
        <br />
        <br />
        <Menu.Item>
          <Header content={"Cell Color"} />
          <ChromePicker />
        </Menu.Item>
      </Menu>
      <PhaserWrapper width={900} height={600} className='game-page-phaser-wrapper' />
    </div>
  );
}

export default GamePage;
/*

function GamePage () {
  const [game, setGame] = useState<GameInstance>()
  const [initialize, setInitialize] = useState(false)

  const destroy = () => {
    console.log('Instance', game?.instance)
    setInitialize(false)
    setGame(undefined)
  }

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig))
    }
  }, [initialize])

  return (
    <Grid stretched>
      <Grid.Row stretched>
        <Grid.Column stretched width={3}>
          <Menu vertical inverted size='large'>
            <Menu.Item>
              <p>This is a menu item</p>
            </Menu.Item>
            <Menu.Item>
              <p>This is also a menu item</p>
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <div className="App">
            <header className="App-header">
              { initialize ? (
                <>
                  <IonPhaser game={game} initialize={initialize} />
                  <div onClick={destroy} className="flex destroyButton">
                    <a href="#1" className="bttn">Destroy</a>
                  </div>
                </>
              ) : (
                <>
                  <img src={logo} className="App-logo" alt="logo" />
                  <div onClick={() => setInitialize(true)} className="flex">
                    <a href="#1" className="bttn">Initialize</a>
                  </div>
                </>
              )}
            </header>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default GamePage;
*/