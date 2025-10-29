#!/bin/bash

g++ seeding.cpp first_script.cpp second_script.cpp entity_arrays.cpp sample_data_arrays.cpp -o seeding -Wall -Wextra -pedantic -Weffc++
./seeding