#include <iostream>
#include <vector>
#include <fstream>
#include <string>
#include "sample_data_arrays.h"
#include "entities.h"
using std::string, std::ofstream, std::cerr, std::endl;

std::vector<std::string> names {
    "Ethan", "Olivia", "Marcus", "Sophia", "Daniel", "Ava", "Julian", "Harper", 
    "Samuel", "Amelia", "Nathan", "Isabella", "Elijah", "Charlotte", "Gabriel", 
    "Mia", "Leo", "Evelyn", "Adrian", "Aria", "Isaac", "Lily", "Caleb", "Grace", 
    "Dominic", "Chloe", "Sebastian", "Zoey", "Lucas", "Nora"
};

string passChars = "abcdefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$&?!#$&?!#$&?!#$&?";

int main() {
    //Create csv files
    const string& filename = "employees.csv";
    ofstream employeeFile(filename);
    if (!employeeFile.is_open()) {
        cerr << "Error opening file: " << filename << endl;
        exit(-1);
    }

    // Write headers
    employeeFile << "ID,Name,Username,Password,Permissions" << endl;

    // Write inventory rows
    for (int i = 0; i < 16; i++){
        string name = names[rand() % 30];
        int nums = rand() % 1000;
        string username = name + std::to_string(nums);
        string password = "";
        for (int j = 0; j < 10; j++) {
            password += passChars[rand() % passChars.size()];
        }
        int perms = rand() % 2;
        employeeFile << i+1 << "," << name << "," << username << "," << password << "," << perms << endl;
    }

    employeeFile.close();
    return 0;
}