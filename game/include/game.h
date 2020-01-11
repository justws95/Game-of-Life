#ifndef GAME_H
#define GAME_H

/*
 * Defines the Game class used to run a game of life simulation.
 */

#include <iostream>
#include <cstdio>
#include <vector>
#include <map>
#include "cell.h"

class Game
{
    private:
        bool limit_iter, active_game;
        int rows, cols, max_iter;
        int starting_cells;
        std::map<std::pair<const int, const int>, Cell*> living_cells;

        void set_random_seed(const int seed = -1);
        void create_initial_cells(); 
        void update_cell_neighbors(Cell*);
        void create_live_cell(const int, const int);
        void kill_cell(std::map<std::pair<const int, const int>, Cell*>::iterator);
        void play_round();
        void find_new_life();
        //void update_cell_grid();

        /*----FUNCTIONS TO REMOVE----*/
        void print_cell_map(); // TODO: Delete after numpy integration successful

    public:
        Game(const int rows, const int cols, const int starting_cells, const int max_iter = -1);
        ~Game();
        void run_game();

        /*----FUNCTIONS TO REMOVE----*/
        void print_game_info(); // TODO: Delete after numpy integration successful
       
};

#endif