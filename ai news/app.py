import os
import requests
import google.generativeai as genai
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

# Load environment variables (API keys) from .env file
load_dotenv()

# Configure Flask app
app = Flask(__name__) # Looks for templates/static folders

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Gemini API Key not found. Make sure it's in the .env file.")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash') # Use a fast model

# Configure NewsAPI
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
if not NEWS_API_KEY:
    raise ValueError("News API Key not found. Make sure it's in the .env file.")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

# --- Helper Functions ---

def get_trending_news(country='us', category='general', count=10):
    """Fetches trending news articles from NewsAPI."""
    params = {
        'apiKey': NEWS_API_KEY,
        'country': country,
        'category': category,
        'pageSize': count
    }
    try:
        response = requests.get(NEWS_API_URL, params=params)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        news_data = response.json()
        return news_data.get('articles', [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return [] # Return empty list on error
    except Exception as e:
        print(f"An unexpected error occurred during news fetching: {e}")
        return []

def summarize_text_with_gemini(text_to_summarize):
    """Summarizes text using the Gemini API."""
    if not text_to_summarize or not isinstance(text_to_summarize, str) or len(text_to_summarize.strip()) < 20:
         # Avoid sending empty or very short strings to the API
        return "Could not summarize (not enough content)."
    try:
        prompt = f"Please summarize the following news article content concisely in 2-3 sentences:\n\n{text_to_summarize}"
        response = gemini_model.generate_content(prompt)
        # Handle potential safety blocks or empty responses
        if response.parts:
             return response.text.strip()
        elif response.prompt_feedback.block_reason:
             return f"Could not summarize due to safety settings: {response.prompt_feedback.block_reason}"
        else:
             return "Could not generate summary (empty response from API)."

    except Exception as e:
        print(f"Error summarizing with Gemini: {e}")
        # Provide more specific error messages if possible
        if "API key not valid" in str(e):
             return "Could not summarize (Invalid Gemini API Key)."
        return "Could not summarize (API error)."


# --- Flask Routes ---

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/api/news')
def api_news():
    """API endpoint to get summarized news."""
    country = request.args.get('country', 'us') # Default to US
    category = request.args.get('category', 'general') # Default to general
    max_articles_to_summarize = 5 # Limit API calls

    print(f"Fetching news for country={country}, category={category}")
    articles = get_trending_news(country=country, category=category, count=max_articles_to_summarize)

    summarized_news = []
    for article in articles:
        title = article.get('title', 'No Title')
        url = article.get('url', '#')
        # Prefer 'content', fallback to 'description' for summarization
        content_to_summarize = article.get('content')
        if not content_to_summarize or len(content_to_summarize) < 50 : # NewsAPI content is often truncated
             content_to_summarize = article.get('description')

        print(f"Summarizing: {title[:50]}...") # Log which article is being summarized
        summary = summarize_text_with_gemini(content_to_summarize)

        summarized_news.append({
            'title': title,
            'url': url,
            'source': article.get('source', {}).get('name', 'Unknown Source'),
            'publishedAt': article.get('publishedAt', ''),
            'imageUrl': article.get('urlToImage'), # Add image URL
            'summary': summary
        })

    print(f"Returning {len(summarized_news)} summarized articles.")
    return jsonify(summarized_news) # Return data as JSON


# --- Run the App ---
if __name__ == '__main__':
    # Use host='0.0.0.0' to make it accessible on your network (optional)
    # Debug=True automatically reloads when you save changes, but DON'T use in production
    app.run(debug=True, port=5001) # Use a port like 5001