// script.js

// Get references to DOM elements
const headerSearchInput = document.getElementById('headerSearchInput');
const headerSearchButton = document.querySelector('#headerSearchInput + .search-button'); // Selects the button next to the input
const headerLoadingSpinner = document.getElementById('headerLoadingSpinner');
const mainNewsResults = document.getElementById('mainNewsResults');

/**
 * Fetches news articles based on a query using the google_search tool.
 * This function updates the main content area with search results.
 * @param {string} query - The search query for news.
 */
async function fetchNews(query) {
    mainNewsResults.innerHTML = ''; // Clear previous results
    headerLoadingSpinner.style.display = 'block'; // Show loading spinner
    headerSearchInput.disabled = true; // Disable input during search
    // headerSearchButton.disabled = true; // No explicit button, using Enter key or icon click

    try {
        // Construct the payload for the google_search tool
        const payload = {
            queries: [query]
        };

        // Make the fetch call to the tool endpoint
        const response = await fetch('/tool_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Search results:", result); // Log the full result for debugging

        // Check if the result has the expected structure and articles
        if (result && result.search_results && Array.isArray(result.search_results) && result.search_results.length > 0) {
            const articles = result.search_results[0].results;

            if (articles && articles.length > 0) {
                articles.forEach(article => {
                    // Create an article card for each result
                    const card = document.createElement('div');
                    card.className = 'article-card'; // Apply the defined card styles

                    // Article title
                    const title = document.createElement('h3');
                    title.className = 'text-xl font-semibold mb-2';
                    title.textContent = article.source_title || 'No Title Available';

                    // Article snippet
                    const snippet = document.createElement('p');
                    snippet.className = 'text-gray-600 mb-4 flex-grow';
                    snippet.textContent = article.snippet || 'No snippet available.';

                    // Article URL (link)
                    const link = document.createElement('a');
                    link.href = article.url || '#';
                    link.className = 'read-more-link'; // Apply the defined link styles
                    link.textContent = article.url ? 'Read More &rarr;' : 'No Link Available';
                    link.target = '_blank'; // Open in new tab

                    // Append elements to the card
                    card.appendChild(title);
                    card.appendChild(snippet);
                    card.appendChild(link);

                    // Append card to the main news results container
                    mainNewsResults.appendChild(card);
                });
            } else {
                mainNewsResults.innerHTML = '<p class="text-gray-500 text-center col-span-full">No articles found for your query. Try a different search term.</p>';
            }
        } else {
            mainNewsResults.innerHTML = '<p class="text-gray-500 text-center col-span-full">Could not retrieve news. Please try again later.</p>';
        }

    } catch (error) {
        console.error('Error fetching news:', error);
        mainNewsResults.innerHTML = `<p class="text-red-500 text-center col-span-full">Error fetching news: ${error.message}. Please check your internet connection or try again.</p>`;
    } finally {
        headerLoadingSpinner.style.display = 'none'; // Hide loading spinner
        headerSearchInput.disabled = false; // Enable input
        // headerSearchButton.disabled = false; // Enable button
    }
}

// Event listener for the search input (on Enter key press)
headerSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = headerSearchInput.value.trim();
        if (query) {
            fetchNews(query);
        } else {
            mainNewsResults.innerHTML = '<p class="text-gray-500 text-center col-span-full">Please enter a search query.</p>';
        }
    }
});

// Optional: Event listener for clicking the search icon (if you add one)
// For this minimalist design, the search is primarily driven by the input field
// and the Enter key, but if you add a visible search button/icon, you'd attach
// an event listener here.

// Initial load: You can uncomment the line below to fetch default news on page load
document.addEventListener('DOMContentLoaded', () => {
    // fetchNews('latest tech innovations'); // Example default search
});

