#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>

using std::cout, std::cerr, std::endl, std::ofstream, std::string;
namespace fs = std::filesystem;

int main() {
    string SQL_FILE_NAME = "sql_files/dbgen.sql";
    ofstream sql_file(SQL_FILE_NAME);

    if(!sql_file.is_open()) {
        cerr << "Could not open file " << SQL_FILE_NAME << endl;
        return -1;
    }

    const fs::path paths = fs::current_path();
    for(const auto& file : fs::directory_iterator(paths)) {
        const string filenameStr = file.path().filename().string();
        size_t extensionPos = filenameStr.find(".csv");
        if(file.is_regular_file() && extensionPos != string::npos) {
            const string tableName = filenameStr.substr(0, extensionPos);
            sql_file << "\\copy " << tableName << " from '" << filenameStr << "' CSV HEADER\n";
        }
    }

    sql_file.close();
    return 0;
}