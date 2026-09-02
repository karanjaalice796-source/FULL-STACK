const libForm = document.getElementById("libform");
const storySpan = document.getElementById("story");
const shuffleButton = document.getElementById("shuffle-button");
const nounInput = document.getElementById("noun");
const adjectiveInput = document.getElementById("adjective");
const personInput = document.getElementById("person");
const verbInput = document.getElementById("verb");
const placeInput = document.getElementById("place");

function getFormValues() {
    const noun = nounInput.value.trim();
    const adjective = adjectiveInput.value.trim();
    const person = personInput.value.trim();
    const verb = verbInput.value.trim();
    const place = placeInput.value.trim();

    if (!noun || !adjective || !person || !verb || !place) {
        alert("Please fill in all fields before generating a story!");
        return null;
    }

    return { noun, adjective, person, verb, place };
}

// 3. Array of story templates for the shuffle feature (Bonus)
function generateStories(values) {
    const { noun, adjective, person, verb, place } = values;

    return [
        `One day, ${person} decided to ${verb} all the way to ${place} with a very ${adjective} ${noun}.`,
        `While visiting ${place}, ${person} found a ${adjective} ${noun} and decided to ${verb} with it!`,
        `It was a ${adjective} day in ${place} when ${person} grabbed a ${noun} and started to ${verb} uncontrollably.`
    ];
}

libForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const values = getFormValues();
    if (!values) return;
    const stories = generateStories(values);
    storySpan.textContent = stories[0];
});

shuffleButton.addEventListener("click", () => {
    const values = getFormValues();
    if (!values) return;

    const stories = generateStories(values);
    const randomIndex = Math.floor(Math.random() * stories.length);
    storySpan.textContent = stories[randomIndex];
});