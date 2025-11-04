// DOM elements
let dateInput, loadingMessage, errorMessage, ratesTable, ratesBody;

// Initialize after DOM loading
document.addEventListener('DOMContentLoaded', function() {
    dateInput = document.getElementById('rateDate');
    loadingMessage = document.getElementById('loadingMessage');
    errorMessage = document.getElementById('errorMessage');
    ratesTable = document.getElementById('ratesTable');
    ratesBody = document.getElementById('ratesBody');

    // Set today's date as maximum and default
    const today = new Date().toISOString().split('T')[0];
    dateInput.max = today;
    dateInput.value = today;

    // Load rates when date changes
    dateInput.addEventListener('change', function() {
        fetchCurrencyRates(this.value);
    });

    // Load rates on page load
    fetchCurrencyRates(today);
});

/**
 * Fetches currency rates from API for specified date
 * @param {string} date - Date in YYYY-MM-DD format
 */
async function fetchCurrencyRates(date) {
    try {
        console.log('Fetching rates for date:', date);

        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        ratesTable.style.display = 'none';

        // EUR currency ID = 2
        const euroId = 2;
        const url = `https://api.tarasantoniuk.com/api/exchange-rates/latest/${date}?currencyFromId=${euroId}`;
        console.log('API URL:', url);

        const response = await fetch(url);

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        console.log('Number of rates:', data.length);

        displayRates(data);

    } catch (error) {
        console.error('Error fetching rates:', error);
        errorMessage.textContent = `Failed to load currency rates: ${error.message}. Please try again later or select a different date.`;
        errorMessage.style.display = 'block';
        loadingMessage.style.display = 'none';
    }
}

/**
 * Displays currency rates in the table
 * @param {Array} data - Array of currency rate data
 */
function displayRates(data) {
    ratesBody.innerHTML = '';

    if (!data || data.length === 0) {
        errorMessage.textContent = 'No currency rates available for the selected date.';
        errorMessage.style.display = 'block';
        loadingMessage.style.display = 'none';
        return;
    }

    // Sort currencies by code
    const sortedData = data.sort((a, b) =>
        a.currencyTo.code.localeCompare(b.currencyTo.code)
    );

    sortedData.forEach(item => {
        const row = document.createElement('tr');

        const currency = item.currencyTo;
        const currencyCode = currency.code;
        const currencyName = currency.name;
        const currencySymbol = currency.symbol;
        const numericCode = currency.numericCode;
        const exchangeDate = item.exchangeDate;
        const rate = item.rate;

        // Format rate based on value
        let formattedRate;
        if (rate >= 100) {
            formattedRate = rate.toFixed(2);
        } else if (rate >= 1) {
            formattedRate = rate.toFixed(4);
        } else {
            formattedRate = rate.toFixed(6);
        }

        row.innerHTML = `
            <td>
                <div class="currency-code">${currencyCode}</div>
                <div class="currency-name">${currencyName} <span class="currency-symbol">${currencySymbol}</span></div>
            </td>
            <td>${numericCode}</td>
            <td>${exchangeDate}</td>
            <td class="rate-value">${formattedRate}</td>
        `;

        ratesBody.appendChild(row);
    });

    loadingMessage.style.display = 'none';
    ratesTable.style.display = 'table';

    console.log('Rates displayed successfully');
}