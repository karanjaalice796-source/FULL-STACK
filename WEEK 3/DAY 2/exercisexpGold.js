//ex.1 isBlank
function isBlank(str) {
    // Trim whitespace and check if string length is zero
    return str.trim().length === 0;
}

console.log(isBlank(''));   
console.log(isBlank('abc')); 
console.log(isBlank('   ')); 

//ex2. abbrevName.
function abbrevName(name) {
    const parts = name.trim().split(" ");
    
    if (parts.length > 1) {
        return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
    }
    
    return parts[0];
}

console.log(abbrevName("Robin Singh"));

//ex3.swapCase
function swapCase(str) {
    return str
        .split('')
        .map(char => {
            if (char === char.toUpperCase()) {
                return char.toLowerCase();
            } else {
                return char.toUpperCase();
            }
        })
        .join('');
}

console.log(swapCase('The Quick Brown Fox')); 

//ex4. isOmnipresent.
function isOmnipresent(arr, val) {
    // Check if every subarray includes the value
    return arr.every(subArr => subArr.includes(val));
}

console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 1));
console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 6));
console.log(isOmnipresent([[3, 4], [8, 3, 2], [3], [9, 3], [5, 3], [4, 3]], 3)); 