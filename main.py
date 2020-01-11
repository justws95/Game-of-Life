import argparse 
import numpy as np 
import matplotlib.pyplot as plt  
import matplotlib.animation as animation 
from game import game
  

def update(): 
    #TODO: Figure out how to update array representation from underlying C++ class
    pass


def main():
    ROWS = 100
    COLS = 100
    START = 250
    ITER = 100

    # Instantiate a game
    Game = game.Game(ROWS, COLS, START, ITER)

    # Grid of cells to be plotted
    grid = np.array()


    # set up animation 
    fig, ax = plt.subplots() 
    img = ax.imshow(grid, interpolation='nearest') 
    ani = animation.FuncAnimation(fig, update, frames=60) 
  
    plt.show() 
  
# call main 
if __name__ == '__main__': 
    main() 