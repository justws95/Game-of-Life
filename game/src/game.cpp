/*---Implements the methods of the Game class.---*/
#include "game.h"


Game::Game(const int rows, const int cols, const int starting_cells, const int max_iter, const int random_seed)
{
    this->rows = rows;
    this->cols = cols;
    this->starting_cells = starting_cells;
    this->max_iter = max_iter;
    this->active_game = false;

    // Set iteration limit if specified and random seed if specified
    max_iter == -1 ? this->limit_iter = false : this->limit_iter = true;
    random_seed == -1 ? srand(time(NULL)) : srand(random_seed);

    // Create a new 2-D Python list object that will be accessed from Python
    this->cell_grid = PyList_New(0);
    
    for(int i = 0; i < this->cols; i++)
    {
        PyList_Append(this->cell_grid, PyList_New(0));
    }

    for(int i = 0; i < this->cols; i++)
    {
        for(int j = 0; j < this->rows; j++)
        {
            PyList_Append(PyList_GET_ITEM(this->cell_grid, i), Py_False);
            
        }
    }

    // Create initial random cells 
    this->create_initial_cells();
}


//TODO: See if destructor can leverage kill_cell() method
Game::~Game()
{
    // Clean up the cell map
    std::map<std::pair<const int, const int>, Cell*>::iterator it, it2;

    for(it = this->living_cells.begin(); it != this->living_cells.end();)
    {
        Cell* cell_to_free = it->second;

        delete cell_to_free;

        it2 = it++;

        this->living_cells.erase(it2);
    }
}


/*
 * Helper fuction to create the initial cells for the game.
 * Only callable if active game is set to false. Otherwise throws an error and exits
 */ 
void Game::create_initial_cells()
{
    //TODO: Evaluate necessity of active_game as class member
    if(this->active_game)
    {
        fprintf(stderr, "Error: create_initial_cells cannot be called when there is already an active game.\n");
        exit(-1);
    }

    // Create [starting_cells] number of unique,random cells and insert them
    for(int n = 0; n < this->starting_cells; n++)
    {
        while(true)
        {
            int new_x = rand() % this->cols;
            int new_y = rand() % this->rows;

            if(this->living_cells.find(std::make_pair(new_x, new_y)) == this->living_cells.end())
            {
                this->create_live_cell(new_x, new_y);
                break;
            }
        }
    }

    // Set the game session to active and update number of living cells
    this->active_game = true;

    // Update the neighbors for each cell
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        this->update_cell_neighbors(it->second);
    }
}


// Helper to update the number of neighbors for a given cell
void Game::update_cell_neighbors(Cell* cell)
{
    const int x_pos = cell->get_x_pos();
    const int y_pos = cell->get_y_pos();

    // Reset the number of neighbors for the cell
    cell->num_neighbors = 0;

    for(int i = x_pos - 1; i <= x_pos + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = y_pos - 1; j <= y_pos + 1; j++)
        {
            if((i == x_pos && j == y_pos) || j < 0 || j >= this->rows)
            {
                continue;
            }
            else
            {
                if(this->living_cells.find(std::make_pair((const int)i, (const int)j)) != this->living_cells.end())
                {
                    ++cell->num_neighbors;
                }
            }
        }
    }
}


// Helper function to create and insert a new cell
void Game::create_live_cell(const int x, const int y)
{
    Cell* new_cell = new Cell(x, y);

    // Insert the newly created cell into the living cell map, keyed on the cells position
    this->living_cells.insert(std::make_pair(std::make_pair(x, y), new_cell));

    // Update the postion in the cell grid. Raise error and exit on failure to set.
    if(PyList_SetItem(PyList_GET_ITEM(this->cell_grid, x), y, Py_True) == -1)
    {
        fprintf(stderr, "ERROR: Unable to set list index at postion (%d,%d)....terminating\n", x, y);
        exit(-1);
    }

    // If this cell was a dead candidate cell, remove it
    if(this->dead_candidates.find(std::make_pair(x, y)) != this->dead_candidates.end())
    {
        this->dead_candidates.erase(std::make_pair(x, y));
    }

    // Update the candidates map with the cells around the new live cell
    for(int i = x - 1; i <= x + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = y - 1; j <= y + 1; j++)
        {
            std::pair<const int, const int> test_cell = std::make_pair(i,j);

            if(j < 0 || j >= this->rows || (i == x && j == y) || this->living_cells.find(test_cell) != this->living_cells.end())
            {
                continue;
            }

            if(this->dead_candidates.find(test_cell) == this->dead_candidates.end())
            {
                this->dead_candidates.insert(std::make_pair(test_cell, 1));
            }
            else
            {
                ++this->dead_candidates.at(test_cell);  
            }
        }
    }


}


// Helper function to kill and delete a cell
void Game::kill_cell(std::map<std::pair<const int, const int>, Cell*>::iterator it)
{
    // Remove the cell from living_cells and delete the Cell*
    std::pair<const int, const int> x_y_pos = it->first;

    this->living_cells.erase(it);

    delete it->second;

    // TODO: See why SetItem causes invalid pointer but SET_ITEM does not
    // Update the postion in the cell grid. Raise error and exit on failure to set.
    PyList_SET_ITEM(PyList_GET_ITEM(this->cell_grid, x_y_pos.first), x_y_pos.second, Py_False);
    /*
    if(PyList_SetItem(PyList_GET_ITEM(this->cell_grid, x_y_pos.first), x_y_pos.second, Py_False) == -1)
    {
        fprintf(stderr, "ERROR: Unable to set list index at postion (%d,%d)....terminating\n", x_y_pos.first, x_y_pos.second);
        exit(-1);
    }
    */

    // Remove or decrement the neighbors of the cell from the dead_candidates map
    for(int i = x_y_pos.first - 1; i <= x_y_pos.first + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = x_y_pos.second - 1; j <= x_y_pos.second + 1; j++)
        {
            std::pair<const int, const int> test_cell = std::make_pair(i, j);
            
            if(j < 0 || j >= this->rows || (i == x_y_pos.first && j == x_y_pos.second) 
                || this->living_cells.find(test_cell) != this->living_cells.end())
            {
                continue;
            }

            if(this->dead_candidates.at(test_cell) == 1)
            {
                this->dead_candidates.erase(test_cell);
            }
            else
            {
                --this->dead_candidates.at(test_cell);
            }
        }
    }

    // See if the newly killed cell has any neighbors and add to dead_candidates as necessary
    for(int i = x_y_pos.first - 1; i <= x_y_pos.first + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = x_y_pos.second - 1; j <= x_y_pos.second + 1; j++)
        {
            if(j < 0 || j >= this->rows || (i == x_y_pos.first && j == x_y_pos.second))
            {
                continue;
            }

            // If at a valid location, check if there is an alive cell. Update candidate info as necessary
            if(this->living_cells.find(std::make_pair(i, j)) != this->living_cells.end())
            {
                std::pair<const int, const int> dead_cell = std::make_pair(x_y_pos.first, x_y_pos.second);

                if(this->dead_candidates.find(dead_cell) == this->dead_candidates.end())
                {
                    this->dead_candidates.insert(std::make_pair(dead_cell, 1));
                }
                else
                {
                    ++this->dead_candidates.at(dead_cell);
                }
                
            }
        }
    }
}


// Function to run a single round of the game of life, according to the rules that Conway proposed
void Game::play_round()
{
    // Kill cells from under/over population
    std::map<std::pair<const int, const int>, Cell*>::iterator kill_it;
    std::vector<std::map<std::pair<const int, const int>, Cell*>::iterator> cells_to_kill;
    
    for(kill_it = this->living_cells.begin(); kill_it != this->living_cells.end(); kill_it++)
    {
        if(kill_it->second->num_neighbors < 2 || kill_it->second->num_neighbors > 3)
        {
            cells_to_kill.push_back(kill_it);
        }
    }

    // Create live cells from dead cells with 3 live neighbors
    std::map<std::pair<const int, const int>, int>::iterator make_it;
    std::vector<std::pair<const int, const int>> cells_to_make;

    for(make_it = this->dead_candidates.begin(); make_it != this->dead_candidates.end(); make_it++)
    {
        if(make_it->second == 3)
        {
            cells_to_make.push_back(make_it->first);
        }
    }
    
    // Kill/create all the cell changes from the round
    for(long unsigned int n = 0; n < cells_to_kill.size(); n++)
    {
        this->kill_cell(cells_to_kill[n]);
    }

    cells_to_kill.clear();

    for(long unsigned int n = 0; n < cells_to_make.size(); n++)
    {
        this->create_live_cell(cells_to_make[n].first, cells_to_make[n].second);
    }

    cells_to_make.clear();

    // Update the neighbors for each cell
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        this->update_cell_neighbors(it->second);
    }
}


// Getter for the cell grid Python list object
PyObject* Game::get_cell_grid()
{
    return PyList_AsTuple(this->cell_grid);
}


// Heper function to print the cell map
void Game::print_cell_map()
{
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    for(int i = 0; i < this->cols; i++)
    {
        for(int j = 0; j < this->rows; j++)
        {
            it = this->living_cells.find(std::make_pair(i, j));

            it == this->living_cells.end() ? printf("-") : printf("X");
        }
        printf("\n");
    }
}


// Helper to print out class info
void Game::print_game_info()
{
    printf("----GAME INFO----\n");
    printf("Limit Iter:\t%s\n", this->limit_iter ? "true" : "false");
    printf("Active Game:\t%s\n", this->active_game ? "true" : "false");
    printf("Rows:\t\t%d\n", this->rows);
    printf("Columns:\t%d\n", this->cols);
    printf("Alive Cells:\t%lu\n", this->living_cells.size());
    printf("Max Iteration:\t%d\n", this->max_iter);
    printf("Starting cells:\t%d\n", this->starting_cells);
    printf("\n\n---------- Cell Map at Current State ----------\n\n");
    this->print_cell_map();
}


//TODO: Delete everything below this line after testing
void Game::print_candidates()
{
    std::map<std::pair<const int, const int>, int>::iterator it;

    printf("ROUND DEAD CANDIDATES\n\n");

    for(it = this->dead_candidates.begin(); it != this->dead_candidates.end(); it++)
    {
        printf("\tDead cell (%d,%d) has %d living neighbors\n", it->first.first, it->first.second, it->second);
    }
}

void Game::print_living_cells()
{
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    printf("ROUND LIVING CELLLS\n\n");

    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        printf("\tLiving cell at location (%d,%d) has %d neighbors\n", it->first.first, it->first.second, it->second->num_neighbors);
    }
}