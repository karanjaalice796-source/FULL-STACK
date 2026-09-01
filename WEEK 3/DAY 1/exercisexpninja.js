//Exercise1. bmi 
const person1 = {
  fullName: "Alice Johnson",
  mass: 68, // kg
  height: 1.7, // meters
  calculateBMI: function () {
    return this.mass / (this.height * this.height);
  },
};

const person2 = {
  fullName: "Bob Smith",
  mass: 85, // kg
  height: 1.8, // meters
  calculateBMI: function () {
    return this.mass / (this.height * this.height);
  },
};

function compareBMI(personA, personB) {
  const bmiA = personA.calculateBMI();
  const bmiB = personB.calculateBMI();

  if (bmiA > bmiB) {
    return personA;
  } else if (bmiB > bmiA) {
    return personB;
  } else {
    return null; // equal BMI - no single "largest"
  }
}

const personWithLargerBMI = compareBMI(person1, person2);

if (personWithLargerBMI) {
  console.log(`${personWithLargerBMI.fullName} has the largest BMI.`);
} else {
  console.log("Both people have the same BMI.");
}

//Exercise2. grade average
// calculateAverage(gradesList) handles ONLY the math: summing and dividing.
function calculateAverage(gradesList) {
  let sum = 0;
  for (let i = 0; i < gradesList.length; i++) {
    sum += gradesList[i];
  }
  return sum / gradesList.length;
}

// findAvg(gradesList) calls calculateAverage(), then handles the
// console.log output and the pass/fail decision.
function findAvg(gradesList) {
  const average = calculateAverage(gradesList);

  console.log(`Average: ${average}`);

  if (average > 65) {
    console.log("Congratulations, you passed!");
  } else {
    console.log("You failed and must repeat the course.");
  }

  return average;
}

// --- Test cases ---
findAvg([70, 80, 90, 65, 75]);
console.log("---");
findAvg([50, 60, 55, 40, 65]); 