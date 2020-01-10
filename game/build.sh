swig -c++ -python game.i
g++ -c -fpic game_wrap.cxx ./src/cell.cpp ./src/game.cpp -I./include -I/usr/include/python3.7
g++ -shared cell.o game.o game_wrap.o -o _game.so
