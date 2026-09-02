//ex1.random number.
function printEvenToRandom() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    console.log(`Random Number: ${randomNumber}`);

    console.log("Even numbers:");
    for (let i = 0; i <= randomNumber; i += 2) {
        console.log(i);
    }
}

printEvenToRandom();

//ex2. capitalize letters.
function capitalize(str) {
    let evenCapitalized = "";
    let oddCapitalized = "";

    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            evenCapitalized += str[i].toUpperCase();
            oddCapitalized += str[i].toLowerCase();
        } else {
            evenCapitalized += str[i].toLowerCase();
            oddCapitalized += str[i].toUpperCase();
        }
    }

    return [evenCapitalized, oddCapitalized];
}

console.log(capitalize("abcdef"));

//ex3. is palindrome
function isPalindrome(str) {
    const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversedStr = cleanedStr.split("").reverse().join("");

    return cleanedStr === reversedStr;
}

console.log(isPalindrome("madam"));
console.log(isPalindrome("kayak")); 
console.log(isPalindrome("hello")); 

//ex4. biggest number
function biggestNumberInArray(arrayNumber) {
    const numbersOnly = arrayNumber.filter(item => typeof item === "number" && !isNaN(item));

    if (numbersOnly.length === 0) {
        return 0;
    }

    return Math.max(...numbersOnly);
}

console.log(biggestNumberInArray([-1, 0, 3, 100, 99, 2, 99])); 
console.log(biggestNumberInArray(['a', 3, 4, 2])); 
console.log(biggestNumberInArray([])); 

//ex5. unique elements
function getUniqueElements(arr) {
    return [...new Set(arr)];
}

const list = [1, 2, 3, 3, 3, 3, 4, 5];
console.log(getUniqueElements(list));

//ex6. calenda
function createCalendar(year, month) {
    const mon = month - 1; 
    const d = new Date(year, mon);
    const table = document.createElement("table");

    table.style.borderCollapse = "collapse";
    table.style.border = "1px solid black";
    const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    let tr = document.createElement("tr");
    
    weekdays.forEach(day => {
        const th = document.createElement("th");
        th.textContent = day;
        th.style.border = "1px solid black";
        th.style.padding = "5px";
        tr.appendChild(th);
    });
    table.appendChild(tr);

    let getDayNumber = (date) => {
        let day = date.getDay();
        if (day === 0) day = 7;
        return day - 1;
    };

    tr = document.createElement("tr");

    for (let i = 0; i < getDayNumber(d); i++) {
        const td = document.createElement("td");
        td.style.border = "1px solid black";
        tr.appendChild(td);
    }

    while (d.getMonth() === mon) {
        const td = document.createElement("td");
        td.textContent = d.getDate();
        td.style.border = "1px solid black";
        td.style.padding = "5px";
        td.style.textAlign = "center";
        tr.appendChild(td);

        if (getDayNumber(d) % 7 === 6) {
            table.appendChild(tr);
            tr = document.createElement("tr");
        }

        d.setDate(d.getDate() + 1);
    }

    if (getDayNumber(d) !== 0) {
        for (let i = getDayNumber(d); i < 7; i++) {
            const td = document.createElement("td");
            td.style.border = "1px solid black";
            tr.appendChild(td);
        }
    }

    table.appendChild(tr);
    document.body.appendChild(table);
}


createCalendar(2012, 9);