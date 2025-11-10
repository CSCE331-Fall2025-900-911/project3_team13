import csv
import random
from datetime import datetime, timedelta
from faker import Faker
import secrets
import string
import re

# Initialize faker
fake = Faker()
Faker.seed(42)
random.seed()

# -----------------------------------------------
# Global tables (lists of dicts)
# -----------------------------------------------
customers = []
employees = []
inventory = []
menu_items = []
menu_item_inventory = []
orders = []
transactions = []
menu_item_order = []
item_editing_table = []

# -----------------------------------------------
# Static data for ingredients and menu items
# -----------------------------------------------
inventory_items = [ # possibly expand later into more detailed items with set quantities, units, etc. such as Ice : 0%, 25%, 50%, 75%, 100%(represented as ints)
    "Boba", "Green Tea", "Black Tea", "Milk", "Sugar", "Ice",
    "Pudding", "Lychee Jelly", "Strawberry Syrup", "Mango Syrup",
    "Tapioca", "Oolong Tea", "Honey", "Cream", "Taro Powder",
    "Matcha", "Whipped Cream", "Chocolate Syrup", "Caramel",
    "Brown Sugar", "Coconut Jelly"
]
menu_items_data = [
    {
        "Name": "Classic Milk Tea",
        "Ingredients": ["Black Tea", "Milk", "Sugar", "Boba", "Ice"],
        "Category": "Milk Tea",
        "Price": 4.50,
        "Modifications": {
            "Sugar": ["0%", "25%", "50%", "75%", "100%"],
            "Ice": ["0%", "25%", "50%", "75%", "100%"],
            "Size": ["Small", "Medium", "Large"]
        }
    },
    {
        "Name": "Taro Milk Tea",
        "Ingredients": ["Taro Powder", "Milk", "Sugar", "Boba", "Ice"],
        "Category": "Milk Tea",
        "Price": 9.50,
        "Modifications": {
            "Sugar": ["0%", "25%", "50%", "75%", "100%"],
            "Ice": ["0%", "25%", "50%", "75%", "100%"],
            "Size": ["Small", "Medium", "Large"]
        }
    },
    {
        "Name": "Matcha Latte",
        "Ingredients": ["Matcha", "Milk", "Sugar", "Ice"],
        "Category": "Milk Tea",
        "Price": 5.00,
        "Modifications": {
            "Sugar": ["0%", "25%", "50%", "75%", "100%"],
            "Ice": ["0%", "25%", "50%", "75%", "100%"],
            "Size": ["Small", "Medium", "Large"]
        }
    },
    {
        "Name": "Strawberry Smoothie",
        "Ingredients": ["Strawberry Syrup", "Milk", "Ice", "Whipped Cream"],
        "Category": "Specialty Drink",
        "Price": 6.50,
        "Modifications": {
            "Sugar": ["0%", "25%", "50%", "75%", "100%"],
            "Ice": ["0%", "25%", "50%", "75%", "100%"],
            "Size": ["Small", "Medium", "Large"]
        }
    },
    {
        "Name": "Brown Sugar Boba",
        "Ingredients": ["Brown Sugar", "Milk", "Boba", "Ice"],
        "Category": "Milk Tea",
        "Price": 5.50,
        "Modifications": {
            "Sugar": ["0%", "25%", "50%", "75%", "100%"],
            "Ice": ["0%", "25%", "50%", "75%", "100%"],
            "Size": ["Small", "Medium", "Large"]
        }
    }
]

# -----------------------------------------------
# Utility Functions
# -----------------------------------------------
def random_datetime(start, end):
    """Return a random datetime between start and end"""
    delta = end - start
    rand_sec = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=rand_sec)

def random_password(length=6):
    # CSV-safe: DictWriter will quote fields, so punctuation is fine.
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(chars) for _ in range(length))

def sanitize_username(name: str) -> str:
    # lower, replace non-alnum with underscores, collapse repeats, strip edges
    base = re.sub(r'[^a-z0-9]+', '_', name.lower())
    base = re.sub(r'_+', '_', base).strip('_')
    return base or "user"

# -----------------------------------------------
# 1. Employees
# -----------------------------------------------
def gen_employees(n=25):
    roles = ["Cashier", "Manager"]
    last_id = 0
    seen_usernames = set()

    for i in range(1, n + 1):
        role = random.choice(roles)
        name = fake.name()
        uname_base = sanitize_username(name)
        uname = uname_base
        # ensure uniqueness
        suffix = 2
        while uname in seen_usernames:
            uname = f"{uname_base}_{suffix}"
            suffix += 1
        seen_usernames.add(uname)

        employees.append({
            "ID": i,
            "Name": name,
            "Username": uname,
            "Password": random_password(),
            "Permissions": 0 if role == "Cashier" else 1
        })
        last_id = i + 1

    # Default admin user: Ian (manager)
    employees.append({
        "ID": last_id,
        "Name": "Ian",
        "Username": "ian",
        "Password": "ian",
        "Permissions": 1
    })
    last_id += 1

    # Default cashier user: John
    employees.append({
        "ID": last_id,
        "Name": "John",
        "Username": "john",
        "Password": "john",
        "Permissions": 0
    })

# -----------------------------------------------
# 2. Customers
# -----------------------------------------------
def gen_customers(n=2500):
    payment_methods = ["Cash", "Card", "Gift Card"]
    for i in range(1, n + 1):
        customers.append({
            "ID": i,
            "Name": fake.name(),
            "Phone": fake.phone_number(),
            "Payment": random.choice(payment_methods)
        })

# -----------------------------------------------
# 3. Inventory
# -----------------------------------------------
def gen_inventory():
    for i, item in enumerate(inventory_items, start=1):
        inventory.append({
            "ID": i,
            "Name": item,
            "Quantity": random.randint(50, 500)
        })

# -----------------------------------------------
# 4. Menu Items and MenuItem_Inventory
# -----------------------------------------------
def gen_menu_items():
    menu_items.clear()
    menu_item_inventory.clear()
    for i, item in enumerate(menu_items_data, start=1):
        menu_items.append({
            "ID": i,
            "Name": item["Name"],
            "Category": item["Category"],
            "Price": item["Price"],
            "Modifications": item.get("Modifications", {})
        })

        # Link ingredients to inventory
        for ing_name in item["Ingredients"]:
            inv_match = next((inv for inv in inventory if inv["Name"].lower() == ing_name.lower()), None)
            if inv_match:
                menu_item_inventory.append({
                    "MenuItemID": i,
                    "InventoryID": inv_match["ID"]
                })


# -----------------------------------------------
# 5. Orders, Transactions, MenuItem_Order, ItemEditingTable
# -----------------------------------------------
def gen_orders_transactions():
    today = datetime.now()
    one_year_ago = today - timedelta(days=365)
    total_sales = 0.0
    order_id = 1

    while total_sales <= 500000.0:
        ts = random_datetime(one_year_ago, today)
        customer = random.choice(customers)
        employee = random.choice(employees)

        order = {
            "ID": order_id,
            "Status": True,
            "Timestamp": ts.strftime("%Y-%m-%d %H:%M")
        }

        total = 0.0
        combo_counter = len(menu_item_order) + 1

        for _ in range(random.randint(1, 5)):
            item = random.choice(menu_items)
            total += item["Price"]

            # Create menu_item_order entry
            menu_item_order.append({
                "ID": combo_counter,
                "MenuItemID": item["ID"],
                "OrderID": order_id
            })

            # --- Generate modifications for this drink ---
            modifications = {
                "Sugar": random.choice(["0%", "25%", "50%", "75%", "100%"]),
                "Ice": random.choice(["0%", "25%", "50%", "75%", "100%"]),
                "Size": random.choice(["Small", "Medium", "Large"])
            }

            for mod_name, mod_value in modifications.items():
                item_editing_table.append({
                    "ComboID": combo_counter,
                    "ModificationType": mod_name,
                    "Value": mod_value
                })

            combo_counter += 1

        transaction = {
            "ID": order_id,
            "CustomerID": customer["ID"],
            "EmployeeID": employee["ID"],
            "Total": round(total, 2),
            "Timestamp": ts.strftime("%Y-%m-%d %H:%M")
        }

        orders.append(order)
        transactions.append(transaction)
        total_sales += total
        order_id += 1

# -----------------------------------------------
# CSV Writing
# -----------------------------------------------
def write_csv(filename, fieldnames, data):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in data:
            writer.writerow(row)

def export_all():
    write_csv("customers.csv", ["ID", "Name", "Phone", "Payment"], customers)
    
    write_csv("employees.csv", ["ID", "Name", "Username", "Password", "Permissions"], employees)
    write_csv("inventory.csv", ["ID", "Name", "Quantity"], inventory)
    write_csv("menu_items.csv", ["ID", "Name", "Category", "Price", "Modifications"], [
        {**m, "Modifications": str(m["Modifications"])} for m in menu_items
    ])
    write_csv("menu_item_inventory.csv", ["MenuItemID", "InventoryID"], menu_item_inventory)
    write_csv("orders.csv", ["ID", "Status", "Timestamp"], orders)
    write_csv("transactions.csv", ["ID", "CustomerID", "EmployeeID", "Total", "Timestamp"], transactions)
    write_csv("menu_item_order.csv", ["ID", "MenuItemID", "OrderID"], menu_item_order)
    write_csv("item_editing_table.csv", ["ComboID", "ModificationType", "Value"], item_editing_table)

    
    print("✅ All CSVs generated successfully.")


def seed_database():
    gen_employees()
    gen_customers()
    gen_inventory()
    gen_menu_items()
    gen_orders_transactions()
    export_all()

if __name__ == "__main__":
    seed_database()
