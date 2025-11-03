// Елементи DOM
let dateInput, loadingMessage, errorMessage, ratesTable, ratesBody;

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    dateInput = document.getElementById('rateDate');
    loadingMessage = document.getElementById('loadingMessage');
    errorMessage = document.getElementById('errorMessage');
    ratesTable = document.getElementById('ratesTable');
    ratesBody = document.getElementById('ratesBody');

    // Встановлюємо сьогоднішню дату як максимальну та за замовчуванням
    const today = new Date().toISOString().split('T')[0];
    dateInput.max = today;
    dateInput.value = today;

    // Завантажуємо курси при зміні дати
    dateInput.addEventListener('change', function() {
        fetchCurrencyRates(this.value);
    });

    // Завантажуємо курси при завантаженні сторінки
    fetchCurrencyRates(today);
});

/**
 * Отримує курси валют з API за вказаною датою
 * @param {string} date - Дата у форматі YYYY-MM-DD
 */
async function fetchCurrencyRates(date) {
    try {
        console.log('Fetching rates for date:', date);

        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        ratesTable.style.display = 'none';

        const url = `https://api.tarasantoniuk.com/api/exchange-rates/date/${date}`;
        console.log('API URL:', url);

//        // Тимчасово використовуємо CORS proxy (видаліть після налаштування CORS на сервері)
//        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
//        console.log('Using proxy:', proxyUrl);
//
//        const response = await fetch(proxyUrl);

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
 * Відображає курси валют у таблиці
 * @param {Array} data - Масив даних про курси валют
 */
function displayRates(data) {
    ratesBody.innerHTML = '';

    if (!data || data.length === 0) {
        errorMessage.textContent = 'No currency rates available for the selected date.';
        errorMessage.style.display = 'block';
        loadingMessage.style.display = 'none';
        return;
    }

    // Сортуємо валюти за кодом
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

        // Форматуємо курс залежно від значення
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