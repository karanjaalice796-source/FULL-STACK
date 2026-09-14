const API_KEY = '9312cb2e9aa8b6ffb8a369f9';
const API_BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const selectFrom = document.getElementById('currency-from');
const selectTo = document.getElementById('currency-to');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const switchBtn = document.getElementById('switch-btn');
const resultContainer = document.getElementById('result-container');
const exchangeRateText = document.getElementById('exchange-rate-text');
const conversionResult = document.getElementById('conversion-result');
const errorMsg = document.getElementById('error-msg');

// 1. Fetch supported currencies to populate options on load
async function fetchCurrencies() {
    try {
        const response = await fetch(`${API_BASE_URL}/codes`);
        if (!response.ok) throw new Error(`Failed to load currency options (${response.status}).`);
        
        const data = await response.json();
        if (data.result !== 'success' || !Array.isArray(data.supported_codes)) {
            throw new Error(data['error-type'] || 'Failed to load currency options.');
        }

        const codes = data.supported_codes; // Array of [code, name]

        // Populate dropdowns
        codes.forEach(([code, name]) => {
            const option1 = document.createElement('option');
            option1.value = code;
            option1.textContent = `${code} - ${name}`;
            
            const option2 = option1.cloneNode(true);

            selectFrom.appendChild(option1);
            selectTo.appendChild(option2);
        });

        // Set default values
        selectFrom.value = 'USD';
        selectTo.value = 'EUR';

    } catch (error) {
        showError(error.message);
    }
}

// 2. Fetch pair conversion rate using async/await
async function convertCurrency() {
    hideError();
    const fromCurrency = selectFrom.value;
    const toCurrency = selectTo.value;
    const amount = amountInput.value;

    if (!amount || amount <= 0) {
        showError('Please enter a valid amount.');
        return;
    }

    try {
        const url = `${API_BASE_URL}/pair/${encodeURIComponent(fromCurrency)}/${encodeURIComponent(toCurrency)}/${encodeURIComponent(amount)}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`Error fetching conversion data (${response.status}).`);

        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rate;
            const result = Number(data.conversion_result);

            exchangeRateText.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
            conversionResult.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
            resultContainer.classList.remove('hidden');
        } else {
            throw new Error(data['error-type'] || 'Conversion failed. Please check inputs.');
        }

    } catch (error) {
        showError(error.message);
    }
}

// Helper functions for error handling
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

function hideError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);

// Bonus: Switch button handler to swap currencies and update conversion automatically
switchBtn.addEventListener('click', () => {
    const temp = selectFrom.value;
    selectFrom.value = selectTo.value;
    selectTo.value = temp;
    
    if (!resultContainer.classList.contains('hidden')) {
        convertCurrency();
    }
});

// Run initialization on page load
fetchCurrencies();