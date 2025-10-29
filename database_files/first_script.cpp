#include <iostream>
#include <vector>
#include <fstream>
#include <string>
#include "sample_data_arrays.h"
#include "entities.h"

using std::string, std::ofstream, std::cout, std::cerr, std::endl;

/**
 * This file seeds the inventory and menu item tables.
 */
void gen_inventory() {
    const string INVENTORY_FILE_NAME = "inventory.csv";
    ofstream inventory_file(INVENTORY_FILE_NAME);

    if (!inventory_file.is_open()) {
        cerr << "Error opening file: " << INVENTORY_FILE_NAME << endl;
        exit(-1);
    }

    inventory_file << "ID,Name,Quantity\n";

    for (int i = 0; i < 40; i++){
        int quantity = (rand() % 60) + 5;
        ingredients.push_back(Ingredient(i+1, inventory_items[i], quantity));
        inventory_file << i+1 << "," << inventory_items[i] << "," << quantity << "\n";
    }

    inventory_file.close();
    cout << "Inventory CSV file generated." << endl;
}

void gen_menu_items() {
    const string MENU_ITEMS_FILE_NAME = "menu_items.csv";
    ofstream menu_file(MENU_ITEMS_FILE_NAME);

    if (!menu_file.is_open()) {
        cerr << "Error opening file: " << MENU_ITEMS_FILE_NAME << endl;
        exit(-1);
    }

    menu_file << "ID,Name,Series,Price,Ingredients\n";

    for (int i = 0; i < 16; i++) {
        int price = (rand() % 90)/5 + 2;
        MenuItem item(i+1, drink_names[i], price);
        menu_file << i+1 << "," << drink_names[i] << "," << ((rand() % 90)/5 + 2) << ",{";
        for (size_t j=0; j < ingredients_list[i].size(); j++) {
            item.ingredients_list.push_back(ingredients_list[i][j]);
            menu_file << ingredients_list[i][j];
            if (j != ingredients_list[i].size()-1) menu_file << "-";
        }
        menu_file << "}\n";
        menu_items.push_back(item);
    }
    
    menu_file.close();
    cout << "Menu item CSV file generated." << endl;
}

void first_script_functions() {
    srand(time(0));

    gen_inventory();
    gen_menu_items();
}