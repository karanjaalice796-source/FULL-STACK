//
const numbers = [5, 0, 9, 1, 7, 4, 2, 6, 3, 8];

// 1. toString() - converts the array to a comma-separated string
const numbersAsString = numbers.toString();
console.log(numbersAsString);
console.log(typeof numbersAsString); 
// 2. join() - converts the array to a string, with a custom separator
console.log(numbers.join("+"));
console.log(numbers.join(" ")); 
console.log(numbers.join("")); 
console.log(numbers.join(", "));

// 3. Bonus - Bubble Sort in descending order, using nested for loops
const numbersToSort = [5, 0, 9, 1, 7, 4, 2, 6, 3, 8];

console.log("--- Starting Bubble Sort ---");
console.log("Initial array:", numbersToSort);

for (let i = 0; i < numbersToSort.length - 1; i++) {
  for (let j = 0; j < numbersToSort.length - 1 - i; j++) {
    if (numbersToSort[j] < numbersToSort[j + 1]) {
      // Swap using a temporary variable
      const temp = numbersToSort[j];
      numbersToSort[j] = numbersToSort[j + 1];
      numbersToSort[j + 1] = temp;
    }
  }

  console.log(`After pass ${i + 1}:`, numbersToSort);
}

console.log("--- Bubble Sort complete ---");
console.log("Final sorted array:", numbersToSort);