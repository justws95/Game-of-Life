import argparse 
import numpy as np 
import matplotlib.pyplot as plt  
import matplotlib.animation as animation 
from game import game

#ROUND = 0 #TODO: Delete after testing

def get_array(Game):
    array = Game.get_cell_grid()

    array = np.array(array)

    return array


def update(frameNum, img, ax, Game): 
    Game.play_round()
    
    """
    global ROUND #TODO: Delete these lines after testing
    print("---------------------------")
    print("Concluded round: ", ROUND)
    ROUND += 1
    Game.print_living_cells()
    Game.print_candidates()
    """
    

    grid = get_array(Game)

    img = ax.imshow(grid, interpolation='nearest') 

    return img


def main():
    ROWS = 75
    COLS = 40
    START = 400
    ITER = -1
    SEED = 42

    if(START > (ROWS * COLS)):
        print("ERROR: The number of starting cells exceeds possible maximum value")
        exit()

    # Instantiate a game
    Game = game.Game(ROWS, COLS, START, ITER, SEED)

    """
    print("Game Initial State") #TODO: Delete these 3 lines
    Game.print_living_cells()
    Game.print_candidates()

    # TODO: Delete after testing
    round = 0

    while round < 10:
        Game.play_round()
        print("---------------------------")
        print("Concluded round: ", round)
        Game.print_living_cells()
        Game.print_candidates()
        round += 1
    """

    # Grid of cells to be plotted
    grid = get_array(Game)

    # set up animation 
    fig, ax = plt.subplots() 
    img = ax.imshow(grid, interpolation='nearest') 
    ani = animation.FuncAnimation(fig, update, fargs=(img, ax, Game, ), frames=15) 

    plt.title("Conway's Game of Life")
    plt.show()
    

  
# call main 
if __name__ == '__main__': 
    main() 