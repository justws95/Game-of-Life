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


let playRound = (oldGrid) => {
  let newGrid = [...oldGrid];

  oldGrid.forEach(x_index => {
    x_index.forEach(y_index => {
      switch(y_index) {
        case true:
          console.log("Reached a living cell.");
          break;
        case false:
          console.log("Reached a dead cell.");
          break;
        default:
          console.log("I have somehow found one of SChrodinger's cells....");
          break;
      }
    });
  });

  return newGrid;
}


class GameScene extends Phaser.Scene {
  constructor(_rows, _cols, _starting_cells, _gameWidth, _gameHeight) {
    console.log("GameScene constructor has been called");
    super("PlayGame");
    this.rows = _rows;
    this.cols = _cols;
    this.gameBoxWidth = _gameWidth;
    this.gameBoxHeight = _gameHeight;
    this.startingCells = _starting_cells;
    this.livingCells = _starting_cells;
    this.iteration = 0;
    this.cellGrid = getInitialGrid(this.rows, this.cols, this.startingCells);


    console.log("About to print the class members at end of constructor");
    console.log("Rows", this.rows);
    console.log("Cols", this.cols);
    console.log("gameBoxWidth", this.gameBoxWidth);
    console.log("gameBoxHeight", this.gameBoxHeight);
    console.log("startingCells", this.startingCells);
    console.log("livingCells", this.livingCells);
    console.log("iteration", this.iteration);
    console.log("cellGrid", this.cellGrid);
  }


  init = function() {
    console.log("In the init function");
  }


  preload = function() {
    console.log("Preload has been called");
    // TODO: Flesh out
    console.log("About to print the class members at time of preload");
    console.log("Rows", this.rows);
    console.log("Cols", this.cols);
    console.log("gameBoxWidth", this.gameBoxWidth);
    console.log("gameBoxHeight", this.gameBoxHeight);
    console.log("startingCells", this.startingCells);
    console.log("livingCells", this.livingCells);
    console.log("iteration", this.iteration);
    console.log("cellGrid", this.cellGrid);
  }


  create = function() {
    console.log("Create has been called");
    this.scoreText = this.add.text(100, 16, 'Living Cells: ' + this.livingCells, { fontSize: '18px', fill: '#ffffff' });
    this.liveText = this.add.text(16, this.sys.game.config.height-50, 'Iteration: ' + this.iteration, {fontSize: '18px', fill: '#ffffff'});

    this.add.grid(
      0,
      0,
      this.gameBoxWidth, 
      this.gameBoxHeight, 
      (1/48 * this.gameBoxWidth),
      (1/48 * this.gameBoxHeight),
      0x646464
    );
  }


  update = function() {
    console.log("Update has been called");
    return;
    this.cellGrid = playRound(this.cellGrid);
    ++this.iteration;
  }
  
  
  end = function() {
    //TODO: Flesh out
    console.log("End has been called");
  }
};


export default GameScene;
