//1. Star pattern single loop ·
// Version 1: a single loop
// We loop over every individual star we need to print (21 total: 1+2+3+4+5+6),
// building up the current row as we go, and printing/resetting the row
// whenever it reaches its target length.

let row = "";
let starsInRow = 0;
let rowLength = 1;

for (let i = 1; i <= 21; i++) {
  row += "* ";
  starsInRow++;

  if (starsInRow === rowLength) {
    console.log(row.trim());
    row = "";
    starsInRow = 0;
    rowLength++;
  }
}

//2. Star pattern nested loop 
// Version 2: two nested for loops
// The outer loop controls which row we're on (1 through 6).
// The inner loop runs exactly as many times as the row number,
// building that row's stars.

for (let i = 1; i <= 6; i++) {
  let row = "";

  for (let j = 1; j <= i; j++) {
    row += "* ";
  }

  console.log(row.trim());
}