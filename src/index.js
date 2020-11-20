import Phaser from "phaser";


let getInitialGrid = (x, y, numCells) => {
  // Create the 2D array to store the cells
  let cellGrid = new Array(x).fill(0);

  for (let i = 0; i < cellGrid.length; i++) {
    cellGrid[i] = new Array(y).fill(0);
  }

  // Populate the initial cells
  let numInserted = 0;

  while (numInserted < numCells) {
    let _x = Math.floor(Math.random() * Math.floor(x));
    let _y = Math.floor(Math.random() * Math.floor(y));

    if (!(cellGrid[_x][_y])) {
      cellGrid[_x][_y] = 1;
      ++numInserted;
    }
  }

  return cellGrid
};


// Count the neighbors for a cell at position (x,y)
let countNeighbors = (x, y, cellGrid, rows, cols) => {
  let numNeighbors = 0;
  let temp_x = 0;
  let temp_y = 0;

  console.log("------------------------------------------");
  console.log("Testing neighbors for cell at position: (", x, ",", y, ").");

  // Count the number of neighbors for a cell, wrapping the container in both axes
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      temp_x = i;
      temp_y = j;
      
      if (i === x && j === y) {
        continue;
      }
      
      if (i < 0) {
        temp_x = rows - 1;
      }
      else if (i >= rows) {
        temp_x = 0 + (i - rows);
      }

      if (j < 0) {
        temp_y = cols - 1;
      }
      else if (j >= cols) {
        temp_y = 0 + (j - cols);
      }

      console.log("The value at (", temp_x, ", ", temp_y, ") was: ", cellGrid[temp_x][temp_y]);

      if (cellGrid[temp_x][temp_y] === 1) {
        ++numNeighbors;
      }
    }
  }

  return numNeighbors;
}


let playRound = (oldGrid, rows, cols) => {
  let newGrid = new Array(oldGrid.length).fill(0);

  for (let i = 0; i < newGrid.length; i++) {
    newGrid[i] = new Array(oldGrid[0].length).fill(0);
  }


  let newCellNum = 0;

  for (let x_index = 0; x_index < cols; x_index++) {
    for (let y_index = 0; y_index < rows; y_index++) {
    
      let neighbors = countNeighbors(x_index, y_index, oldGrid, rows, cols);

      console.log("The number of neighbors for this cell was: ", neighbors);

      switch(oldGrid[x_index][y_index] === 1) {
        case true:
          console.log("This cell is currently alive");
          if (neighbors === 2 || neighbors === 3) {
            console.log("Setting this position to ALIVE next round");
            newGrid[x_index][y_index] = 1;
            ++newCellNum;
          }
          else {
            console.log("Setting this position to DEAD next round");
            newGrid[x_index][y_index] = 0;
          }

          break;
        case false:
          console.log("This cell is currently dead");
          if (neighbors === 3) {
            console.log("Setting this position to ALIVE next round");
            newGrid[x_index][y_index] = 1;
            ++newCellNum;
          }
          else {
            console.log("Setting this position to DEAD next round");
            newGrid[x_index][y_index] = 0;
          }

          break;
        default:
          console.log("I have somehow found one of Schrodinger's cells....");
          break;
      }
    }
  }

  return [newGrid, newCellNum];
}


let drawCells = (graphics, rows, cols, cellGrid, cellWidth, cellHeight) => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (cellGrid[i][j] === 1) {
        graphics.fillStyle(0x05f7a7, 1);
        graphics.fillRect(
          (i * cellWidth), 
          (j * cellHeight), 
          cellWidth - 2, 
          cellHeight - 2
        );
      }
    }
  }  
}


let gameScene = new Phaser.Scene('Game');

let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 720,
  scene: gameScene
};

gameScene.init = function() {
  this.rows = 80;
  this.cols = 80;
  this.gameBoxWidth = 1200;
  this.gameBoxHeight = 720;
  this.cellWidth = (this.gameBoxWidth / this.cols);
  this.cellHeight = (this.gameBoxHeight / this.rows);
  this.startingCells = Math.floor(this.rows * this.cols * 0.10);
  this.livingCells = this.startingCells;
  this.iteration = 0;
  this.cellGrid = getInitialGrid(this.rows, this.cols, this.startingCells);
  this.timerTick = 0;
  this.updateFreq = 60; // Update once per second
  this.graphics = null;
}


gameScene.preload = function() {
}


gameScene.create = function() {
  // Create the playing grid
  this.add.grid(
    0,
    0,
    this.gameBoxWidth, 
    this.gameBoxHeight,
    this.cellWidth,
    this.cellHeight,
    0x646464
  ).setOrigin(0,0);

  // Draw the initial cells
  this.graphics = this.add.graphics();
  drawCells(this.graphics, this.rows, this.cols, this.cellGrid, this.cellWidth, this.cellHeight);
}


gameScene.update = function() {
  ++this.timerTick;
  
  //if (this.timerTick >=  this.updateFreq && this.timerTick % this.updateFreq === 0) {
  if (true) {
    console.log("Playing round: ", this.iteration);
    [this.cellGrid, this.livingCells] = playRound(this.cellGrid, this.rows, this.cols);
    //throw new Error("Something went badly wrong!");
    this.graphics.clear();
    drawCells(this.graphics, this.rows, this.cols, this.cellGrid, this.cellWidth, this.cellHeight);
    ++this.iteration;
    console.log("The number of living cells is: ", this.livingCells);
  }
}


gameScene.end = function() {
  //TODO: Flesh out
}


const game = new Phaser.Game(config);
