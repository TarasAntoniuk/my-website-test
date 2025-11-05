// DOM elements
let dateInput, loadingMessage, errorMessage, ratesTable, ratesBody;

// Initialize after DOM loading
document.addEventListener('DOMContentLoaded', function() {
    dateInput = document.getElementById('rateDate');
    loadingMessage = document.getElementById('loadingMessage');
    errorMessage = document.getElementById('errorMessage');
    ratesTable = document.getElementById('ratesTable');
    ratesBody = document.getElementById('ratesBody');

    // Set today's date in dd/mm/yyyy format
    const today = new Date();
    const formattedToday = formatDateToDisplay(today);
    dateInput.value = formattedToday;

    // Add date input mask and validation
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }

        e.target.value = value;
    });

    // Load rates when Enter is pressed or input loses focus
    dateInput.addEventListener('blur', function() {
        validateAndFetchRates(this.value);
    });

    dateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAndFetchRates(this.value);
        }
    });

    // Load rates on page load
    fetchCurrencyRates(formatDateToAPI(today));
});

/**
 * Format Date object to dd/mm/yyyy string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDateToDisplay(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Format Date object to yyyy-mm-dd string for API
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDateToAPI(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

/**
 * Parse dd/mm/yyyy string to yyyy-mm-dd format
 * @param {string} dateString - Date in dd/mm/yyyy format
 * @returns {string|null} - Date in yyyy-mm-dd format or null if invalid
 */
function parseDateString(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Validate ranges
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
        return null;
    }

    // Check if date is not in the future
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (inputDate > today) {
        return null;
    }

    return formatDateToAPI(inputDate);
}

/**
 * Validate date input and fetch rates
 * @param {string} dateString - Date string in dd/mm/yyyy format
 */
function validateAndFetchRates(dateString) {
    const apiDate = parseDateString(dateString);

    if (!apiDate) {
        errorMessage.textContent = 'Invalid date format. Please use dd/mm/yyyy and ensure the date is not in the future.';
        errorMessage.style.display = 'block';
        ratesTable.style.display = 'none';
        loadingMessage.style.display = 'none';
        return;
    }

    fetchCurrencyRates(apiDate);
}

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

        // Format date to European format (dd/mm/yyyy)
        const formattedDate = new Date(exchangeDate + 'T00:00:00').toLocaleDateString('en-GB');

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
            <td>${formattedDate}</td>
            <td class="rate-value">${formattedRate}</td>
        `;

        ratesBody.appendChild(row);
    });

    loadingMessage.style.display = 'none';
    ratesTable.style.display = 'table';

    console.log('Rates displayed successfully');
}