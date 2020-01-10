#ifndef GAME_H
#define GAME_H

// FIXME: Constructor currently public, i.e. not a singleton
/*
 * Defines the Game class used to run a game of life simulation.
 * The game class is implemented in the Singleton design pattern so
 * that only a single instance of the game can be instantiated.
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
        void print_cell_map();

    public:
        Game(const int rows, const int cols, const int starting_cells, const int max_iter = -1);
        ~Game();
        void run_game();
        void print_game_info();
       
};

#endif