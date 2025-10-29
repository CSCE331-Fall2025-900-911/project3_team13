#include <vector>
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>
#include <random>
#include <chrono>
#include <iomanip>

/**
 * Driver file to seed the database.
 * first_script_functions() handles seeding the inventory and menu items
 * second_script_functions() handles seeding the orders, customers, and transactions
 */
void first_script_functions();
void second_script_functions();

int main() {
    first_script_functions();
    second_script_functions();
}