// #ex1.
function funcOne() {
    let a = 5;
    if(a > 1) {
        a = 3;
    }
    alert(`inside the funcOne function ${a}`);
}

let aTwo = 0;
function funcTwo() {
    aTwo = 5;
}
function funcThree() {
    alert(`inside the funcThree function ${aTwo}`);
}

function funcFour() {
    window.a = "hello";
}
function funcFive() {
    alert(`inside the funcFive function ${aTwo}`);
}

let aSix = 1;
function funcSix() {
    let localA = "test";
    alert(`inside the funcSix function ${localA}`);
}

let aIf = 2;
if (true) {
    let blockA = 5;
    alert(`in the if block ${blockA}`);
}
alert(`outside of the if block ${aIf}`);

//ex2. ternary operator
const winBattle = () => true;

const experiencePoints = winBattle() ? 10 : 1;

console.log(experiencePoints); 

//ex3. is it a string?
const isString = (value) => typeof value === 'string';

console.log(isString('hello'));  
console.log(isString([1, 2, 4, 0]));

//ex4. find the sum
const sum = (a, b) => a + b;

console.log(sum(5, 10));

//ex5. kg and grams
// 1. Function Declaration
function convertKgToGramsDeclaration(kg) {
    return kg * 1000;
}
console.log('Declaration:', convertKgToGramsDeclaration(2));

// 2. Function Expression
const convertKgToGramsExpression = function(kg) {
    return kg * 1000;
};
console.log('Expression:', convertKgToGramsExpression(3));

// 3. One-line Arrow Function
const convertKgToGramsArrow = kg => kg * 1000;
console.log('Arrow:', convertKgToGramsArrow(4));

//ex6. fortune teller
(function(numChildren, partnerName, location, jobTitle) {
    const sentence = `You will be a ${jobTitle} in ${location}, and married to ${partnerName} with ${numChildren} kids.`;
    document.getElementById('fortune').textContent = sentence;
})(3, 'Sarah', 'Nairobi', 'Full Stack Developer');

//ex7.welcome
(function(userName) {
    const navbar = document.getElementById('navbar');
    
    const userDiv = document.createElement('div');
    userDiv.className = 'user-info';
     
    const userText = document.createElement('span');
    userText.textContent = `Welcome, ${userName}`;
    
    const userImg = document.createElement('img');
    userImg.src = 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg';
    userImg.alt = 'Profile Picture';
    
    userDiv.appendChild(userText);
    userDiv.appendChild(userImg);
    navbar.appendChild(userDiv);
})('John');

//ex8. juice bar
// Part I & Part II Combined
function makeJuice(size) {
    const ingredients = [];

    function addIngredients(ing1, ing2, ing3) {
        ingredients.push(ing1, ing2, ing3);
    }

    function displayJuice() {
        const sentence = `The client wants a ${size} juice, containing ${ingredients.join(', ')}.`;
        document.getElementById('juice-order').textContent = sentence;
    }

    // Adding 6 ingredients by invoking twice
    addIngredients('apple', 'banana', 'ginger');
    addIngredients('spinach', 'lemon', 'mint');

    // Displaying order
    displayJuice();
}

// Global invocation
makeJuice('medium');