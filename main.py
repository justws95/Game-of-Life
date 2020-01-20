import argparse 
import numpy as np 
import matplotlib.pyplot as plt  
import matplotlib.animation as animation 
from game import game


def get_array(Game):
    array = Game.get_cell_grid()

    array = np.array(array)

    return array


def update(frameNum, img, ax, Game): 
    Game.play_round()
    grid = get_array(Game)

    img = ax.imshow(grid, interpolation='nearest') 

    return img


def main():
    ROWS = 100
    COLS = 100
    START = 10000
    ITER = -1
    SEED = -1

    if(START > (ROWS * COLS)):
        print("ERROR: The number of starting cells exceeds possible maximum value")
        exit()

    # Instantiate a game
    Game = game.Game(ROWS, COLS, START, ITER, SEED)

    # Grid of cells to be plotted
    grid = get_array(Game)

    # set up animation 
    fig, ax = plt.subplots() 
    img = ax.imshow(grid, interpolation='nearest') 
    ani = animation.FuncAnimation(fig, update, fargs=(img, ax, Game, ), frames=30) 

    plt.title("Conway's Game of Life")
    plt.show()

  
# call main 
if __name__ == '__main__': 
    main() 