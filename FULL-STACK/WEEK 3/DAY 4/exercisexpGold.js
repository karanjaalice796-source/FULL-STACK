//ex1. nested functions
const landscape = () => {
  let result = "";

  const flat = x => {
    for (let count = 0; count < x; count++) {
      result += "_";
    }
  };

  const mountain = x => {
    result += "/";
    for (let counter = 0; counter < x; counter++) {
      result += "'";
    }
    result += "\\";
  };

  flat(4);
  mountain(4);
  flat(4);

  return result;
};

console.log(landscape());

//ex2. closure
const addTo = x => y => x + y;
const addToTen = addTo(10);

console.log(addToTen(3));

//ex3. currying
const curriedSum = (a) => (b) => a + b;
const add5 = curriedSum(5);

console.log(add5(12));

//5. composing
const compose = (f, g) => (a) => f(g(a));
const add1 = (num) => num + 1;
const add5 = (num) => num + 5;

console.log(compose(add1, add5)(10));
