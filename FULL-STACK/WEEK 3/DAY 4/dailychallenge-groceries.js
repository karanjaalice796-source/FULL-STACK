let client = "John";

const groceries = {
    fruits: ["pear", "apple", "banana"],
    vegetables: ["tomatoes", "cucumber", "salad"],
    totalPrice: "20$",
    other: {
        paid: true,
        meansOfPayment: ["cash", "creditCard"]
    }
};

const displayGroceries = () => {
    groceries.fruits.forEach(fruit => console.log(fruit));
};

const cloneGroceries = () => {
    let user = client;
    client = "Betty";
    
    console.log(`user: ${user}`);
    console.log(`client: ${client}`);

    let shopping = groceries;
    
    shopping.totalPrice = "35$";
    shopping.other.paid = false;
    console.log("groceries object after modifications:", groceries);
    console.log("shopping object after modifications:", shopping);
};

// Invoke the functions
displayGroceries();
cloneGroceries();