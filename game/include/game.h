// Defines the Game class used to run a game of life simulation.
#ifndef GAME_H
#define GAME_H

//#define PY_SSIZE_T_CLEAN
#include <python3.7m/Python.h>
#include <iostream>
#include <cstdio>
#include <map>
#include "cell.h"

class Game
{
    private:
        bool limit_iter, active_game;
        int rows, cols, max_iter;
        int starting_cells;
        std::map<std::pair<const int, const int>, Cell*> living_cells;

        void create_initial_cells(); 
        void update_cell_neighbors(Cell*);
        void create_live_cell(const int, const int);
        void kill_cell(std::map<std::pair<const int, const int>, Cell*>::iterator);
        void play_round();
        void find_new_life();

        // FUNCTIONS TO REMOVE
        void print_cell_map(); // TODO: Delete after numpy integration successful

    public:
        Game(const int, const int, const int, const int max_iter = -1, const int random_seed = -1);
        ~Game();
        void run_game();
        PyObject* get_list();
        void print_game_info();
};

#endif