#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>
#include <random>
#include <chrono>
#include <iomanip>
#include "sample_data_arrays.h"
#include "entities.h"

using std::cout, std::cerr, std::endl, std::ofstream, std::vector, 
std::string, std::random_device, std::mt19937, std::uniform_int_distribution, 
std::time_t, std::put_time, std::localtime;
using namespace std::chrono;

/**
 * This file seeds the customers, orders, and transactions tables.
 * Due to cross-dependencies among these tables (e.g. customers relying on orders for order history), 
 * instances of each entity are generated before the CSV files are written.
 */
void gen_customers() {
    int curr_size = 30, id = 1;
    for(int i = 0; i < 2500; i++) {
        int names_ind = rand() % curr_size;
        string name = names[names_ind];
        long phone_number = rand() % static_cast<long>(1e10);

        customers.push_back(Customer(id++, phone_number, name));
    }
}

system_clock::time_point random_datetime( 
    const system_clock::time_point& start,
    const system_clock::time_point& end) {
    auto diff = duration_cast<seconds>(end - start).count();

    static random_device random_device;
    static mt19937 gen(random_device());
    uniform_int_distribution<long long> dist(0, diff);
    
    auto rand_seconds = dist(gen);
    return start + seconds(rand_seconds);
}

/**
 * Note: it is ideal to generate Orders and Transactions at the same time because of 
 * their similar attributes.
*/
void gen_orders() {
    time_point today = system_clock::now();
    time_point one_year_ago = today - hours(24 * 365);

    double total_sales = 0.0;
    int id = 1;
    while(total_sales <= 750000.0) {
        auto rand_time = random_datetime(one_year_ago, today);
        time_t rand_time_t = system_clock::to_time_t(rand_time);

        Order order(id, rand_time_t);
        int num_items = rand() % 5 + 1;
        double total = 0.0;
        for(int i = 0; i < num_items; i++) {
            MenuItem item = menu_items[rand() % 16];
            order.list_of_items.push_back(item.id);
            total += item.price;
        }

        int customer_id = rand() % 2500 + 1;
        Transaction transaction(id, customer_id, total, rand_time_t);

        orders.push_back(order);
        transactions.push_back(transaction);
        customers[customer_id-1].order_history.push_back(id);
        total_sales += total;
        id++;
    }
}

void gen_customers_csv() {
    const string CUSTOMERS_FILE_NAME = "customers.csv";
    ofstream customers_file(CUSTOMERS_FILE_NAME);

    if(!customers_file.is_open()) {
        cerr << "Could not open file " << CUSTOMERS_FILE_NAME << endl;
        exit(-1);
    }

    customers_file << "ID,Name,PhoneNumber,History" << endl;
    
    for(Customer customer: customers) {
        customers_file << customer.id << "," << customer.name << "," 
            << customer.phone_number << ",{";
        for(size_t i = 0; i < customer.order_history.size(); i++) {
            customers_file << customer.order_history[i];
            if(i != customer.order_history.size()-1) customers_file << "-";
        }
        customers_file << "}\n";
    }

    customers_file.close();
    cout << "Customers CSV file generated." << endl;
}

void gen_orders_csv() {
    const string ORDERS_FILE_NAME = "orders.csv";
    ofstream orders_file(ORDERS_FILE_NAME);

    if(!orders_file.is_open()) {
        cerr << "Could not open file " << ORDERS_FILE_NAME << endl;
        exit(-1);
    }

    orders_file << "ID,ItemsList,Timestamp\n";

    for(Order order: orders) {
        orders_file << order.id << ",{";
        for(size_t i = 0; i < order.list_of_items.size(); i++) {
            orders_file << order.list_of_items[i];
            if(i != order.list_of_items.size()-1) orders_file << "-";
        };
        orders_file << "}," << put_time(localtime(&order.timestamp), "%F %R") << "\n";
    }

    orders_file.close();
    cout << "Orders CSV file generated." << endl;
}

void gen_transactions_csv() {
    const string TRANSACTIONS_FILE_NAME = "transactions.csv";
    ofstream transactions_file(TRANSACTIONS_FILE_NAME);

    if(!transactions_file.is_open()) {
        cerr << "Could not open file " << TRANSACTIONS_FILE_NAME << endl;
        exit(-1);
    }

    transactions_file << "ID,CustomerID,Total,Timestamp\n";

    for(Transaction transaction: transactions) {
        transactions_file << transaction.id << "," << transaction.customer_id << "," 
            << transaction.total << "," << put_time(localtime(&transaction.timestamp), "%F %R") 
            << "\n";
    }

    transactions_file.close();
    cout << "Transactions CSV file generated." << endl;
}

void second_script_functions() {
    srand(time(0));

    gen_customers();
    gen_orders();
    gen_customers_csv();
    gen_orders_csv();
    gen_transactions_csv();
}