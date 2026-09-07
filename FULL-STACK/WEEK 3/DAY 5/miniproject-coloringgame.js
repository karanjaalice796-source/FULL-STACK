// Data & App State
const colors = [
  "#FF0000", "#FF7F00", "#FFFF00", 
  "#00FF00", "#0000FF", "#4B0082", 
  "#9400D3", "#FFC0CB", "#FFFFFF", 
  "#8B4513", "#808080", "#000000"
];

let currentColor = colors[0];
let isMouseDown = false;

// DOM Selectors
const paletteContainer = document.getElementById("palette");
const canvasContainer = document.getElementById("canvas");
const clearBtn = document.getElementById("clear-btn");

// 1. Generate Palette
function createPalette() {
  colors.forEach((color, index) => {
    const swatch = document.createElement("div");
    swatch.classList.add("color-swatch");
    swatch.style.backgroundColor = color;

    if (index === 0) swatch.classList.add("active");

    swatch.addEventListener("click", () => {
      document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      currentColor = color;
    });

    paletteContainer.appendChild(swatch);
  });
}

// 2. Generate Canvas Grid (24x24 = 576 pixels)
function createCanvas(size = 24) {
  canvasContainer.innerHTML = "";
  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");

    // Single click coloring
    pixel.addEventListener("mousedown", () => {
      pixel.style.backgroundColor = currentColor;
    });

    // Drag coloring
    pixel.addEventListener("mouseover", () => {
      if (isMouseDown) {
        pixel.style.backgroundColor = currentColor;
      }
    });

    canvasContainer.appendChild(pixel);
  }
}

// 3. Track Mouse State for Drag-Drawing
document.body.addEventListener("mousedown", () => (isMouseDown = true));
document.body.addEventListener("mouseup", () => (isMouseDown = false));

// 4. Clear Canvas Action
clearBtn.addEventListener("click", () => {
  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach(pixel => (pixel.style.backgroundColor = "#ffffff"));
});

// Initialize App
createPalette();
createCanvas(24);