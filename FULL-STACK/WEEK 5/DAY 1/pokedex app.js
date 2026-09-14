// DOM Element Selectors
const pokeImg = document.getElementById('poke-img');
const pokeName = document.getElementById('poke-name');
const pokeId = document.getElementById('poke-id');
const pokeHeight = document.getElementById('poke-height');
const pokeWeight = document.getElementById('poke-weight');
const pokeType = document.getElementById('poke-type');

const pokemonCard = document.getElementById('pokemon-card');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const randomBtn = document.getElementById('random-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Global variable to keep track of the current Pokémon ID
let currentPokemonId = 1;
const MAX_POKEMON = 898; // Total standard Pokedex entries available via PokeAPI

// Helper to switch display states
function showState({ showCard = false, showLoading = false, showError = false }) {
    pokemonCard.classList.toggle('hidden', !showCard);
    loadingDiv.classList.toggle('hidden', !showLoading);
    errorDiv.classList.toggle('hidden', !showError);
}

// Core function to fetch and display a Pokémon by ID
async function fetchPokemon(id) {
    showState({ showLoading: true });

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const data = await response.json();

        // Update global tracking variable
        currentPokemonId = data.id;

        // Extract required information
        const name = data.name;
        const sprite = data.sprites.front_default || data.sprites.other['official-artwork'].front_default;
        const height = data.height;
        const weight = data.weight;
        const types = data.types.map(t => t.type.name).join(', ');

        // Render to DOM
        pokeImg.src = sprite;
        pokeName.textContent = name;
        pokeId.textContent = `#${String(data.id).padStart(3, '0')}`;
        pokeHeight.textContent = `${height} decimeters`;
        pokeWeight.textContent = `${weight} hectograms`;
        pokeType.textContent = types;

        console.log(`Current Pokémon ID: ${currentPokemonId}`);
        showState({ showCard: true });

    } catch (error) {
        console.error('Error fetching data:', error);
        showState({ showError: true });
    }
}

// 1. Random Button Function (Async/Await)
async function fetchRandomPokemon() {
    // Generate a random ID between 1 and MAX_POKEMON
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    await fetchPokemon(randomId);
}

// 2. Previous Button Function (Async/Await)
async function fetchPreviousPokemon() {
    let targetId = currentPokemonId - 1;
    if (targetId < 1) targetId = MAX_POKEMON; // Loop around to the end if below 1
    await fetchPokemon(targetId);
}

// 3. Next Button Function (Async/Await)
async function fetchNextPokemon() {
    let targetId = currentPokemonId + 1;
    if (targetId > MAX_POKEMON) targetId = 1; // Loop around to the beginning if above max
    await fetchPokemon(targetId);
}

// Event Listeners
randomBtn.addEventListener('click', fetchRandomPokemon);
prevBtn.addEventListener('click', fetchPreviousPokemon);
nextBtn.addEventListener('click', fetchNextPokemon);

// Initialize application with Pokemon #1 (Bulbasaur) on load
fetchPokemon(1);