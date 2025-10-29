#pragma once

#include <string>
#include <vector>
#include <ctime>

/**
 * These structs reprsent each entity in the database. They, along with the vectors storing
 * each instance of these structs, were created to ease the data generation and seeding process.
*/
struct Ingredient {
    int id;
    std::string name;
    int quantity;
    Ingredient(int id, std::string name, int quantity): 
        id(id), name(name), quantity(quantity) {};
};

struct MenuItem {
    int id;
    std::string name_and_series;
    double price;
    std::vector<int> ingredients_list;
    MenuItem(int id, std::string name_and_series, double price): 
        id(id), name_and_series(name_and_series), price(price), 
            ingredients_list(std::vector<int>()) {};
};

struct Customer {
    int id;
    std::vector<int> order_history;
    long phone_number;
    std::string name;

    Customer(int id, long ph, std::string name): id(id), order_history(std::vector<int>()), 
    phone_number(ph), name(name) {};
};

struct Order {
    int id;
    std::vector<int> list_of_items;
    std::time_t timestamp;
    Order(int id, std::time_t ts): id(id), list_of_items(std::vector<int>()), timestamp(ts) {};
};

struct Transaction {
    int id;
    int customer_id;
    double total;
    std::time_t timestamp;
    Transaction(int id, int c_id, double total, std::time_t ts): 
        id(id), customer_id(c_id), total(total), timestamp(ts) {};
};

extern std::vector<Ingredient> ingredients;
extern std::vector<MenuItem> menu_items;
extern std::vector<Order> orders;
extern std::vector<Transaction> transactions;
extern std::vector<Customer> customers;