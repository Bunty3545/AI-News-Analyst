document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadingIndicator = document.getElementById('loading');

    // Function to fetch and display news
    async function fetchNews() {
        loadingIndicator.style.display = 'block'; // Show loading
        newsContainer.innerHTML = ''; // Clear previous news
        try {
            // Fetch data from our Flask backend API endpoint
            const response = await fetch('/api/news');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newsItems = await response.json();
            loadingIndicator.style.display = 'none'; // Hide loading

            if (newsItems.length === 0) {
                newsContainer.innerHTML = '<p class="error-message">No news articles found or failed to fetch news.</p>';
                return;
            }

            // Create HTML for each news item
            newsItems.forEach(item => {
                const articleElement = document.createElement('article');
                articleElement.classList.add('news-article');

                let imageHtml = '';
                if (item.imageUrl) {
                    imageHtml = `<img src="${item.imageUrl}" alt="Image for ${item.title}" loading="lazy">`;
                }

                articleElement.innerHTML = `
                    ${imageHtml}
                    <h2><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></h2>
                    <div class="meta">
                        Source: ${item.source || 'N/A'} | Published: ${item.publishedAt ? new Date(item.publishedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div class="summary">
                        <strong>AI Summary:</strong> ${item.summary || 'Summary not available.'}
                    </div>
                `;
                newsContainer.appendChild(articleElement);
            });

        } catch (error) {
            loadingIndicator.style.display = 'none'; // Hide loading on error
            console.error('Error fetching or displaying news:', error);

            let errorMessage = 'Failed to load news. Please check your internet connection or try again later.';
            if (error.message.includes('HTTP error')) {
                errorMessage = `Failed to load news. Server returned status: ${error.message.split('Status: ')[1]}. Check backend logs.`;
            } else if (error instanceof TypeError) {
                errorMessage = 'Failed to load news. Network error or unable to connect to the backend.';
            }
            newsContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        }
    }

    // Initial fetch on page load
    fetchNews();

    // Optional: handle filter form submission to update country/category
    const filterForm = document.getElementById('news-filter-form');
    filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const country = document.getElementById('country-select').value;
        const category = document.getElementById('category-select').value;
        try {
            loadingIndicator.style.display = 'block';
            newsContainer.innerHTML = '';
            const response = await fetch(`/api/news?country=${country}&category=${category}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const newsItems = await response.json();
            loadingIndicator.style.display = 'none';

            if (newsItems.length === 0) {
                newsContainer.innerHTML = '<p class="error-message">No news found for selected filters.</p>';
                return;
            }

            newsItems.forEach(item => {
                const articleElement = document.createElement('article');
                articleElement.classList.add('news-article');

                let imageHtml = '';
                if (item.imageUrl) {
                    imageHtml = `<img src="${item.imageUrl}" alt="Image for ${item.title}" loading="lazy">`;
                }

                articleElement.innerHTML = `
                    ${imageHtml}
                    <h2><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></h2>
                    <div class="meta">
                        Source: ${item.source || 'N/A'} | Published: ${item.publishedAt ? new Date(item.publishedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div class="summary">
                        <strong>AI Summary:</strong> ${item.summary || 'Summary not available.'}
                    </div>
                `;
                newsContainer.appendChild(articleElement);
            });
        } catch (error) {
            loadingIndicator.style.display = 'none';
            newsContainer.innerHTML = `<p class="error-message">Error fetching filtered news: ${error.message}</p>`;
        }
    });
});
