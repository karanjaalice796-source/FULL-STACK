//ex1. change the article
const article = document.querySelector("article");
const h1 = article.querySelector("h1");
console.log(h1);

const lastP = article.lastElementChild;
lastP.remove();

const h2 = article.querySelector("h2");
h2.addEventListener("click", () => {
    h2.style.backgroundColor = "red";
});

const h3 = article.querySelector("h3");
h3.addEventListener("click", () => {
    h3.style.display = "none";
});

const boldBtn = document.getElementById("boldBtn");
boldBtn.addEventListener("click", () => {
    const paragraphs = article.querySelectorAll("p");
    paragraphs.forEach(p => p.style.fontWeight = "bold");
});
h1.addEventListener("mouseover", () => {
    const randomSize = Math.floor(Math.random() * 101);
    h1.style.fontSize = `${randomSize}px`;
});

const secondP = article.querySelectorAll("p")[1];
secondP.addEventListener("mouseover", () => {
    secondP.classList.add("fade-out");
});

//ex2. work with forms
const form = document.querySelector("form");
console.log(form);
const fnameInput = document.getElementById("fname");
const lnameInput = document.getElementById("lname");
console.log(fnameInput, lnameInput);
const fnameByName = document.getElementsByName("firstname")[0];
const lnameByName = document.getElementsByName("lastname")[0];
console.log(fnameByName, lnameByName);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstNameVal = fnameInput.value.trim();
    const lastNameVal = lnameInput.value.trim();
    const usersAnswerUl = document.querySelector(".usersAnswer");

    usersAnswerUl.innerHTML = "";

    if (firstNameVal !== "" && lastNameVal !== "") {
        const li1 = document.createElement("li");
        li1.textContent = firstNameVal;

        const li2 = document.createElement("li");
        li2.textContent = lastNameVal;

        usersAnswerUl.appendChild(li1);
        usersAnswerUl.appendChild(li2);
    } else {
        alert("Please fill in both first name and last name fields.");
    }
});

//ex3. Transform the Sentence
let allBoldItems;
function getBoldItems() {
    const para = document.getElementById("targetPara");
    allBoldItems = para.querySelectorAll("strong");
}

function highlight() {
    allBoldItems.forEach(item => {
        item.style.color = "blue";
    });
}

function returnItemsToDefault() {
    allBoldItems.forEach(item => {
        item.style.color = "black";
    });
}

getBoldItems();

const targetPara = document.getElementById("targetPara");
targetPara.addEventListener("mouseover", highlight);
targetPara.addEventListener("mouseout", returnItemsToDefault);

//ex4.