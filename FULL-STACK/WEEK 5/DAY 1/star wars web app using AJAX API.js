// 1. Retrieve elements from the DOM
const btn = document.getElementById('btn');
const card = document.getElementById('card');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const nameEl = document.getElementById('name');
const heightEl = document.getElementById('height');
const genderEl = document.getElementById('gender');
const birthYearEl = document.getElementById('birth-year');
const homeworldEl = document.getElementById('homeworld');

// Helper function to manage UI display states
function showState({ showCard = false, showLoading = false, showError = false }) {
    card.classList.toggle('hidden', !showCard);
    loadingDiv.classList.toggle('hidden', !showLoading);
    errorDiv.classList.toggle('hidden', !showError);
}

// 2. Fetch Homeworld name using its URL
async function fetchHomeworld(homeworldUrl) {
    try {
        const response = await fetch(homeworldUrl);
        if (!response.ok) throw new Error('Failed to fetch homeworld');
        const data = await response.json();
        return data.result.properties.name;
    } catch (error) {
        console.error('Error fetching homeworld:', error);
        return 'Unknown';
    }
}

// 3. Get the character data from the API using async/await and Fetch API
async function getRandomCharacter() {
    // Total count of characters in SWAPI is roughly 83
    const randomId = Math.floor(Math.random() * 83) + 1;
    const url = `https://www.swapi.tech/api/people/${randomId}`;

    // Show loading state and hide card/error
    showState({ showLoading: true });

    try {
        const response = await fetch(url);
        
        // Handle invalid responses (e.g. 404 if a specific ID doesn't exist)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const characterProps = data.result.properties;

        // Fetch homeworld name asynchronously
        const homeworldName = await fetchHomeworld(characterProps.homeworld);

        // Package data for DOM rendering
        const characterInfo = {
            name: characterProps.name,
            height: characterProps.height,
            gender: characterProps.gender,
            birth_year: characterProps.birth_year,
            homeworld: homeworldName
        };

        displayCharacter(characterInfo);
    } catch (error) {
        console.error('Fetch error:', error);
        showState({ showError: true });
    }
}

// 4. Display the info on the DOM
function displayCharacter(data) {
    nameEl.textContent = data.name;
    heightEl.textContent = `${data.height} cm`;
    genderEl.textContent = data.gender;
    birthYearEl.textContent = data.birth_year;
    homeworldEl.textContent = data.homeworld;

    // Show the card and hide loading
    showState({ showCard: true });
}

// Event listener for button click
btn.addEventListener('click', getRandomCharacter);