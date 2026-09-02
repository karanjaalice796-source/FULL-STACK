//ex1. timer
setTimeout(() => {
    alert("Hello World");
}, 2000);

setTimeout(() => {
    const container = document.getElementById("container");
    const p = document.createElement("p");
    p.textContent = "Hello World";
    container.appendChild(p);
}, 2000);

const container = document.getElementById("container");
const clearBtn = document.getElementById("clear");

function addParagraph() {
    const p = document.createElement("p");
    p.textContent = "Hello World";
    container.appendChild(p);

    const paragraphs = container.querySelectorAll("p");
    if (paragraphs.length >= 5) {
        clearInterval(timerInterval);
    }
}

const timerInterval = setInterval(addParagraph, 2000);

clearBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
});