document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');

    // --- Simulated API Fetch Function ---
    // In a real application, this would use fetch() to call an external URL
    function fetchTrendingAINews() {
        console.log('Simulating API call to fetch AI news...');

        // Return a Promise to mimic asynchronous network request
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Sample news data (replace with real API response structure)
                const sampleNewsData = [
                    {
                        id: 1,
                        title: "New Breakthrough in Large Language Model Efficiency",
                        summary: "Researchers announce a novel technique that significantly reduces the computational cost of training large language models.",
                        source: "AI Research Institute",
                        url: "#", // Placeholder URL
                        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString() // 2 hours ago
                    },
                    {
                        id: 2,
                        title: "Global Leaders Convene for AI Safety Summit",
                        summary: "Representatives from over 25 countries met to discuss international cooperation on managing the risks associated with advanced AI.",
                        source: "World News Agency",
                        url: "#",
                        timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString() // 5 hours ago
                    },
                    {
                        id: 3,
                        title: "Generative AI Transforms Creative Industries",
                        summary: "A new report highlights the growing impact of AI tools on graphic design, music composition, and content creation.",
                        source: "Tech Chronicle",
                        url: "#",
                        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString() // 1 day ago
                    },
                     {
                        id: 4,
                        title: "OpenAI Releases Updates to its API",
                        summary: "OpenAI has rolled out several enhancements to its API offerings, including cost reductions and new model capabilities.",
                        source: "AI Tech Today",
                        url: "#",
                        timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString() // 2 days ago
                    }
                ];

                // Simulate potential API success or failure (optional)
                const success = Math.random() > 0.1; // 90% chance of success

                if (success) {
                    console.log('Simulated API call successful.');
                    resolve(sampleNewsData); // Send back the data on success
                } else {
                    console.error('Simulated API call failed.');
                    reject('Failed to fetch news from the simulated API.'); // Send back an error on failure
                }
            }, 1500); // Simulate 1.5 seconds delay
        });
    }

    // --- Function to Display News ---
    function displayNews(articles) {
        // Clear the "Loading..." message or previous content
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p>No trending AI news found at the moment.</p>';
            return;
        }

        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.classList.add('news-article');

            // Format date (optional)
            const date = new Date(article.timestamp).toLocaleString();

            articleElement.innerHTML = `
                <h2><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h2>
                <p>${article.summary}</p>
                <p class="source">Source: ${article.source} | Published: ${date}</p>
            `;
            // Basic security: avoid setting innerHTML with user-generated content directly in real apps if possible
            // Better approach for security: create elements and set textContent

            newsContainer.appendChild(articleElement);
        });
    }

    // --- Function to Display Errors ---
    function displayError(errorMessage) {
         newsContainer.innerHTML = `<p style="color: red; text-align: center;">Error: ${errorMessage}</p>`;
    }

    // --- Initial Load ---
    fetchTrendingAINews()
        .then(newsData => {
            // Process and display the data
            displayNews(newsData);
        })
        .catch(error => {
            // Handle errors from the API call
            console.error('Error fetching or displaying news:', error);
            displayError(error || 'Could not load news.');
        });
});