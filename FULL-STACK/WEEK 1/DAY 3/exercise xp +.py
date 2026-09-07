#1. Student Grade Summary
student_grades = {
    "Alice": [88, 92, 100],
    "Bob": [75, 78, 80],
    "Charlie": [92, 90, 85],
    "Dana": [83, 88, 92],
    "Eli": [78, 80, 72]
}

# 1. Calculate the average grade for each student
student_averages = {}
for name, grades in student_grades.items():
    average = sum(grades) / len(grades)
    student_averages[name] = average

# 2. Assign letter grades based on average grade
student_letter_grades = {}
for name, avg in student_averages.items():
    if avg >= 90:
        grade = 'A'
    elif avg >= 80:
        grade = 'B'
    elif avg >= 70:
        grade = 'C'
    elif avg >= 60:
        grade = 'D'
    else:
        grade = 'F'
    student_letter_grades[name] = grade

# 3. Calculate the class average
total_average = sum(student_averages.values())
class_size = len(student_averages)
class_average = total_average / class_size

# 4. Print summary report
print(f"Class Average: {class_average:.2f}\n")
print("--- Student Grade Summary ---")

max_name_length = max(len(name) for name in student_grades.keys())
for name in student_grades.keys():
    spaces = ' ' * (max_name_length - len(name))
    print(f"{name}:{spaces} Average Grade = {student_averages[name]:.2f}, Letter Grade = {student_letter_grades[name]}")


#2. Advanced Data Manipulation and Analysis
sales_data = [
    {"customer_id": 1, "product": "Smartphone", "price": 600, "quantity": 1, "date": "2023-04-03"},
    {"customer_id": 2, "product": "Laptop", "price": 1200, "quantity": 1, "date": "2023-04-04"},
    {"customer_id": 1, "product": "Laptop", "price": 1000, "quantity": 1, "date": "2023-04-05"},
    {"customer_id": 2, "product": "Smartphone", "price": 500, "quantity": 2, "date": "2023-04-06"},
    {"customer_id": 3, "product": "Headphones", "price": 150, "quantity": 4, "date": "2023-04-07"},
    {"customer_id": 3, "product": "Smartphone", "price": 550, "quantity": 1, "date": "2023-04-08"},
    {"customer_id": 1, "product": "Headphones", "price": 100, "quantity": 2, "date": "2023-04-09"},
]

# Task 1: Add "total_price" to each transaction
for transaction in sales_data:
    transaction["total_price"] = transaction["price"] * transaction["quantity"]

# Task 2: Calculate Total Sales per Product Category
total_sales_per_product = {}
for transaction in sales_data:
    product = transaction["product"]
    total_sales_per_product[product] = total_sales_per_product.get(product, 0) + transaction["total_price"]

# Task 3: Customer Spending Profile
customer_spending = {}
for transaction in sales_data:
    cid = transaction["customer_id"]
    customer_spending[cid] = customer_spending.get(cid, 0) + transaction["total_price"]

# Task 4: High-Value Transactions (> $500, sorted descending)
high_value_transactions = [t for t in sales_data if t["total_price"] > 500]
high_value_transactions.sort(key=lambda x: x["total_price"], reverse=True)

# Task 5: Customer Loyalty Identification (> 1 purchase)
purchase_counts = {}
for transaction in sales_data:
    cid = transaction["customer_id"]
    purchase_counts[cid] = purchase_counts.get(cid, 0) + 1

loyal_customers = [cid for cid, count in purchase_counts.items() if count > 1]

# Bonus Task 1: Average Transaction Value per Product Category
category_counts = {}
for transaction in sales_data:
    product = transaction["product"]
    category_counts[product] = category_counts.get(product, 0) + 1

avg_transaction_value = {
    product: total_sales_per_product[product] / category_counts[product]
    for product in total_sales_per_product
}

# Bonus Task 2: Most Popular Product (by Quantity Sold)
quantity_per_product = {}
for transaction in sales_data:
    product = transaction["product"]
    quantity_per_product[product] = quantity_per_product.get(product, 0) + transaction["quantity"]

most_popular_product = max(quantity_per_product, key=quantity_per_product.get)

# --- Output Results ---
print("Total Sales per Product:", total_sales_per_product)
print("Customer Spending:", customer_spending)
print("Loyal Customers (Customer IDs):", loyal_customers)
print("Average Transaction Value per Product:", avg_transaction_value)
print(f"Most Popular Product: {most_popular_product} ({quantity_per_product[most_popular_product]} units sold)")