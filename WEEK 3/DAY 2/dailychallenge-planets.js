const planets = [
  { name: "Mercury", color: "#b1adad", moons: 0 },
  { name: "Venus", color: "#e8cda2", moons: 0 },
  { name: "Earth", color: "#4f83cc", moons: 1 },
  { name: "Mars", color: "#c1440e", moons: 2 },
  { name: "Jupiter", color: "#d8ca9d", moons: 4 },
  { name: "Saturn", color: "#ead6b8", moons: 4 },
  { name: "Uranus", color: "#9fe3de", moons: 3 },
  { name: "Neptune", color: "#3f54ba", moons: 2 },
];

const section = document.querySelector(".listPlanets");

planets.forEach((planet) => {
  // Create the planet div
  const planetDiv = document.createElement("div");
  planetDiv.classList.add("planet");
  planetDiv.style.backgroundColor = planet.color;
  planetDiv.textContent = planet.name;

  for (let i = 0; i < planet.moons; i++) {
    const moonDiv = document.createElement("div");
    moonDiv.classList.add("moon");

    const angle = (360 / planet.moons) * i;
    const radius = 60; 
    const offsetX = radius * Math.cos((angle * Math.PI) / 180);
    const offsetY = radius * Math.sin((angle * Math.PI) / 180);

    moonDiv.style.left = `calc(50% + ${offsetX}px)`;
    moonDiv.style.top = `calc(50% + ${offsetY}px)`;

    planetDiv.appendChild(moonDiv);
  }

  section.appendChild(planetDiv);
});