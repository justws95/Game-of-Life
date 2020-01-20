/*---Implements the methods of the Game class.---*/
#include "game.h"


Game::Game(const int rows, const int cols, const int starting_cells, const int max_iter, const int random_seed)
{
    this->rows = rows;
    this->cols = cols;
    this->starting_cells = starting_cells;
    this->max_iter = max_iter;
    this->active_game = false;

    // Set iteration limit if specified
    max_iter == -1 ? this->limit_iter = false : this->limit_iter = true;

    // Set the random seed if specified
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

    // Create initial cells at random    
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
    //TODO: Evaluate necessity of check and of class member
    if(this->active_game)
    {
        printf("Error: create_initial_cells cannot be called when there is already an active game.\n");
        exit(-1);
    }

    // Create [starting_cells] number of unique,random cells and insert them
    for(int n = 0; n < this->starting_cells; n++)
    {
        // Make a new cell that has unique coordinates
        while(true)
        {
            int new_x = rand() % this->cols;
            int new_y = rand() % this->rows;

            if(this->living_cells.find(std::make_pair(new_x, new_y)) == this->living_cells.end())
            {
                this->create_live_cell(new_x, new_y);
                break;
            }
            else
            {
                continue;
            }
            
        }
    }


    // Set the game session to active and update number of living cells
    this->active_game = true;

    // Create a cell map iterator
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    // Update the neighbors for each cell
    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        // Update the cells neighbors
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
        // Break out when less than 0, since this cannot happen with mapping schema
        if(i < 0)
        {
            continue;
        }

        for(int j = y_pos - 1; j <= y_pos + 1; j++)
        {
            if((i == x_pos && j == y_pos) || y_pos < 0)
            {
                continue;
            }
            else
            {
                // Check the map of living cells for the existence of the neighbor
                std::pair<const int, const int> test_coords = std::make_pair((const int) i, (const int) j);

                if(this->living_cells.find(test_coords) != this->living_cells.end())
                {
                    cell->num_neighbors++;
                }
            }
        }
    }
}


// Helper function to create and insert a new cell
void Game::create_live_cell(const int x, const int y)
{
    Cell* new_cell = new Cell(x, y);

    // Insert the newly created cell into our living cell map, keyed on the cells position
    std::pair<const int, const int> coords = std::make_pair(x,y);
    std::pair<std::pair<const int, const int>, Cell*> new_map_val = std::make_pair(coords, new_cell);

    this->living_cells.insert(new_map_val);

    // Update the candidates map with the cells around the new live cell
    for(int i = x - 1; i <= x + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = y - 1; j <= y + 1; j++)
        {
            std::pair<const int, const int> dead_cell = std::make_pair(i,j);

            if(j < 0 || j >= this->rows || (i == x && j == y) || this->living_cells.find(dead_cell) != this->living_cells.end())
            {
                continue;
            }

            // Reaching this point implies that location (i,j) is both valid and currently dead. Add to candidates
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

    // Update the postion in the cell grid. Raise error and exit on failure to set.
    if(PyList_SetItem(PyList_GET_ITEM(this->cell_grid, x), y, Py_True) == -1)
    {
        fprintf(stderr, "ERROR: Unable to set list index at postion (%d,%d)....terminating\n", x, y);
        exit(-1);
    }
}


// Helper function to kill and delete a cell
void Game::kill_cell(std::map<std::pair<const int, const int>, Cell*>::iterator it)
{
    std::pair<const int, const int> x_y_pos = it->first;

    this->living_cells.erase(it);

    delete it->second;

    // Remove or decrement the neighbors of the cell from the dead_candidates map
    for(int i = x_y_pos.first - 1; i <= x_y_pos.first + 1; i++)
    {
        if(i < 0 || i >= this->cols)
        {
            continue;
        }

        for(int j = x_y_pos.second - 1; j <= x_y_pos.second + 1; j++)
        {
            std::pair<const int, const int> dead_cell = std::make_pair(i,j);

            if(j < 0 || j >= this->rows || (i == x_y_pos.first && j == x_y_pos.second) 
                || this->living_cells.find(dead_cell) != this->living_cells.end())
            {
                continue;
            }

            // If the cell is in fact dead, decrement or remove from candidates map if only 1 neighbor
            if(this->dead_candidates.find(dead_cell) != this->dead_candidates.end()) //TODO: Think about why this is needed
            {
                if(this->dead_candidates.at(dead_cell) == 1) // TODO: Check exception behavior
                {
                    this->dead_candidates.erase(dead_cell);
                }
                else
                {
                    --this->dead_candidates.at(dead_cell);
                }
            }
        }
    }

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
    
    // Kill all the cells in the vector to be killed
    for(long unsigned int n = 0; n < cells_to_kill.size(); n++)
    {
        this->kill_cell(cells_to_kill[n]);
    }

    cells_to_kill.clear();

    // Make all cells in vector of cells to be created
    for(long unsigned int n = 0; n < cells_to_make.size(); n++)
    {
        this->create_live_cell(cells_to_make.at(n).first, cells_to_make.at(n).second);
    }

    // Remove the newly made cells from the dead candidates map
    for(long unsigned int n = 0; n < cells_to_make.size(); n++)
    {
        this->dead_candidates.erase(cells_to_make.at(n));
    }

    cells_to_make.clear();

    // Update the neighbors for each cell
    std::map<std::pair<const int, const int>, Cell*>::iterator it;

    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        // Update the cells neighbors
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
    // Create a cell map iterator
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