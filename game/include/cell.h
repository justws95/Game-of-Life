#ifndef CELL_H
#define CELL_H

#include <utility>

class Cell
{
    private:
        int num_neighbors, turns_alive;
        int x_pos, y_pos;

        Cell(const int x, const int y);

        friend class Game; //TODO: Evaluate if single function in game can be friended to modify cells
    
    public:
        const int get_x_pos();
        const int get_y_pos();
        const std::pair<const int, const int> get_pos_pair();
};

#endif