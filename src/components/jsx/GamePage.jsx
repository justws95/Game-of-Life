import React from 'react';
import { Grid, Menu, Dropdown, Header } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';

import PhaserWrapper from './PhaserWrapper';


function GamePage(props) {
  /*
  return (
    <React.Fragment>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column width={3} stretched>
          <Menu
            vertical
            size='large'
            
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
          </Grid.Column>
          <Grid.Column  width={12} verticalAlign='middle'>
            <PhaserWrapper 
              width={900}
              height={600}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
  */

  return (
    <div className='game-page-container'>
      <Menu
        vertical
        size='large'
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
      <PhaserWrapper width={900} height={600} />
    </div>
  );
}

export default GamePage;
