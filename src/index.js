import Phaser from "phaser";


let getInitialGrid = (x, y, numCells) => {
  // Create the 2D array to store the cells
  let cellGrid = new Array(x).fill(false);

  for (let i = 0; i < cellGrid.length; i++) {
    cellGrid[i] = new Array(y).fill(false);
  }

  // Populate the initial cells
  let numInserted = 0;

  while (numInserted < numCells) {
    let _x = Math.floor(Math.random() * Math.floor(x));
    let _y = Math.floor(Math.random() * Math.floor(y));

    if (!(cellGrid[_x][_y])) {
      cellGrid[_x][_y] = true;
      ++numInserted;
    }
  }

  return cellGrid
};


// Count the neighbors for a cell at position (x,y)
let countNeighbors = (x, y, cellGrid, rows, cols) => {
  let numNeighbors = 0;

  // Count the number of neighbors for a cell, wrapping the container in both axes
  for (let i = x - 1; i < x + 1; i++) {
    for (let j = y - 1; j < y + 1; j++) {

      // Skip for the cell whose neighbors are being counted
      if (i === x && j === y) {
        continue;
      }
      
      // Wrap x-axis as needed
      if (i <= 0) {
        i = rows - 1;
      }
      else if (i >= rows) {
        i = 0 + (i - rows);
      }

      // Wrap y-axis as needed
      if (j <= 0) {
        j = cols - 1;
      }
      else if (j >= cols) {
        j = 0 + (j - cols);
      }

      if (cellGrid[i][j]) {
        ++numNeighbors;
      }
    }
  }

  return numNeighbors;
}


let playRound = (oldGrid, rows, cols) => {
  let newGrid = [...oldGrid];
  let newCellNum = 0;

  oldGrid.forEach(x_index => {
    x_index.forEach(y_index => {
      let neighbors = countNeighbors(x_index, y_index, oldGrid, rows, cols);

      switch(y_index) {
        case true:
          if (neighbors === 2 || neighbors === 3) {
            newGrid[x_index][y_index] = true;
            ++newCellNum;
          }
          else {
            newGrid[x_index][y_index] = false;
          }

          break;
        case false:
          if (neighbors === 3) {
            newGrid[x_index][y_index] = true;
            ++newCellNum;
          }
          else {
            newGrid[x_index][y_index] = false;
          }

          break;
        default:
          console.log("I have somehow found one of Schrodinger's cells....");
          break;
      }
    });
  });

  return [newGrid, newCellNum];
}

let gameScene = new Phaser.Scene('Game');

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: gameScene
};

gameScene.init = function() {
  this.rows = 20
  this.cols = 20
  this.gameBoxWidth = 800;
  this.gameBoxHeight = 600;
  this.startingCells = Math.floor(this.rows * this.cols * 0.6);
  this.livingCells = this.startingCells;
  this.iteration = 0;
  this.cellGrid = getInitialGrid(this.rows, this.cols, this.startingCells);
}


gameScene.preload = function() {
}


gameScene.create = function() {
  this.add.grid(
    0,
    0,
    this.gameBoxWidth, 
    this.gameBoxHeight,
    (this.gameBoxWidth / this.cols),
    (this.gameBoxHeight / this.rows),
    0x646464
  ).setOrigin(0,0);
}


gameScene.update = function() {
  return;
  [this.cellGrid, this.livingCells] = playRound(this.cellGrid, this.rows, this.cols);
  ++this.iteration;
  console.log("The number of living cells is: ", this.livingCells);
}


gameScene.end = function() {
  //TODO: Flesh out
}


const game = new Phaser.Game(config);
