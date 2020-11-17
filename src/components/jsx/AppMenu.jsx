import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'


function GameMenu() {
  const [activeItem, setActive] = useState('GAME');

  return (
    <Menu tabular>
      <Menu.Item
        as={Link}
        to="/"
        name='Simulator'
        active={activeItem === 'GAME'}
        onClick={ e => {
          setActive('GAME');
        }}
      />
      <Menu.Item
        as={Link}
        to="/about"
        name='About'
        active={activeItem === 'ABOUT'}
        onClick={ e => {
          setActive('ABOUT');
        }}
      />
    </Menu>
  );
}

export default GameMenu;
