#include "cell.h"


// Implement the constructor
Cell::Cell(const int x, const int y)
{
    this->x_pos = x;
    this->y_pos = y;
}


// Getter for x position
const int Cell::get_x_pos()
{
    return (const int)this->x_pos;
}


// Getter for y position
const int Cell::get_y_pos()
{
    return (const int)this->y_pos;
}


// Getter for x,y pair
const std::pair<const int, const int> Cell::get_pos_pair()
{
    std::pair<const int, const int> pos_pair = std::make_pair(this->x_pos, this->y_pos);

    return pos_pair;
}