document.addEventListener('DOMContentLoaded', () => {
    

    const currentTheme = localStorage.getItem('theme');

    // Set the theme based on the user's preference or default to light theme
    if (currentTheme === 'dark') {
        document.body.id = 'theme-dark';
    }

    // Get the switch element
    const themeToggle = document.getElementById('theme-toggle');

    // Add a click event listener to the switch
    themeToggle.addEventListener('click', () => {
        // Toggle the theme by changing the body's ID and storing the preference in localStorage
        if (document.body.id === 'theme-dark') {
            document.body.id = 'theme-light';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.id = 'theme-dark';
            localStorage.setItem('theme', 'dark');
        }
    });
    // Fetch data from your Node.js server
    fetch('/get-tickers')
        .then((response) => response.json())
        .then((data) => {
            const tickerTable = document.getElementById('tickerTable');
            const highestCryptoInfo = document.getElementById('highestCryptoInfo');

            // Find the cryptocurrency with the highest buying price
            let highestBuyPriceCrypto = null;
            let highestBuyPrice = 0;
            data.forEach((ticker) => {
                if (ticker.buy > highestBuyPrice) {
                    highestBuyPrice = ticker.buy;
                    highestBuyPriceCrypto = ticker;
                }
            });

            // Display the highest buying price crypto information
            if (highestBuyPriceCrypto) {
                highestCryptoInfo.textContent = `${highestBuyPriceCrypto.name} - Buy Price: ${highestBuyPriceCrypto.buy}, Sell Price: ${highestBuyPriceCrypto.sell}, Volume: ${highestBuyPriceCrypto.volume}, Base Unit: ${highestBuyPriceCrypto.base_unit}`;
                highestCryptoInfo.style.fontSize = '24px'
            }

            // Limit the data to the top 10 entries
            const top10Data = data.slice(0, 10);
            top10Data.forEach((ticker) => {
                const row = tickerTable.insertRow();
                row.insertCell(0).textContent = ticker.name;
                row.insertCell(1).textContent = ticker.last;
                row.insertCell(2).textContent = ticker.buy;
                row.insertCell(3).textContent = ticker.sell;
                row.insertCell(4).textContent = ticker.volume;
                row.insertCell(5).textContent = ticker.base_unit;
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
});

var countdownNumberEl = document.getElementById('countdown-number');
var countdown = 10;

countdownNumberEl.textContent = countdown;

setInterval(function() {
  countdown = --countdown <= 0 ? 60 : countdown;

  countdownNumberEl.textContent = countdown;
}, 1000);