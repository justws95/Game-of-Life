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
}


// Helper function to kill and delete a cell
void Game::kill_cell(std::map<std::pair<const int, const int>, Cell*>::iterator it)
{
    this->living_cells.erase(it);

    delete it->second;
}


// Function to run a single round of the game of life, according to the rules that Conway proposed
void Game::play_round()
{
    std::map<std::pair<const int, const int>, Cell*>::iterator it, it2;

    // Kill cells from under/over population
    for(it = this->living_cells.begin(); it != this->living_cells.end();)
    {

        it2 = it++;

        if(it2->second->num_neighbors < 2 || it2->second->num_neighbors > 3)
        {
            this->kill_cell(it2);
        }
    }

    // Create live cells from dead cells with 3 live neighbors
    this->find_new_life();

    // Update the neighbors for each cell
    for(it = this->living_cells.begin(); it != this->living_cells.end(); it++)
    {
        // Update the cells neighbors
        this->update_cell_neighbors(it->second);
    }
}


//TODO: This is a naive and inefficient implementation. See about using the living cell map to find new life
//  Helper function to loop through grid and find dead cells to make alive
void Game::find_new_life()
{
    // Loop through every cell loctaion
    for(int i = 0; i < this->rows; i++)
    {
        for(int j = 0; j < this->cols; j++)
        {
            // See if the cell is alive. If so, continue
            if(this->living_cells.find(std::make_pair(i, j)) != this->living_cells.end())
            {
                continue;
            }

            int num_living_neighbors = 0;

            for(int x = i - 1; x <= i + 1; x++)
            {
                // Continue if the location is out of bounds
                if(x < 0 || x >= this->rows)
                {
                    continue;
                }

                for(int y = j - 1; y <= j + 1; y++)
                {
                    // Continue if the location is out of bounds
                    if(y < 0 || y >= this->cols)
                    {
                        continue;
                    }

                    if(this->living_cells.find(std::make_pair(x,y)) != this->living_cells.end())
                    {
                        ++num_living_neighbors;
                    }
                }
            }

            // If a dead cell has 3 living neighbors, bring it to life
            if(num_living_neighbors == 3)
            {
                this->create_live_cell(i, j);
            }
        }
    }
}


// Handler to run the game simulation
void Game::run_game()
{
    if(this->limit_iter)
    {
        for(int n = 0; n < this->max_iter; n++)
        {
            this->play_round();
        }
    }
    else
    {
        fprintf(stderr, "Error: Functionalty not yet implemented\n");
    }
}


// Function to return a Python list, to be used in Python module
PyObject* Game::get_list()
{
    // Create a new 2-D list of size this->rows x this->cols
    PyObject* cell_grid_list = PyList_New(0);
    
    for(int i = 0; i < this->cols; i++)
    {
        PyList_Append(cell_grid_list, PyList_New(0));
    }

    // Append the rows and initialize
    for(int i = 0; i < this->cols; i++)
    {
        for(int j = 0; j < this->rows; j++)
        {
            if(this->living_cells.find(std::make_pair(i, j)) == this->living_cells.end())
            {
                PyList_Append(PyList_GET_ITEM(cell_grid_list, i), Py_False);
            }
            else
            {
                PyList_Append(PyList_GET_ITEM(cell_grid_list, i), Py_True);
            }
            
        }
    }

    return cell_grid_list;
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


// Helper to print out lass info
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