from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Market data with simplified structure
market_data = {
    'price_trends': [
        {'month': 'Jan', 'price': 250000},
        {'month': 'Feb', 'price': 255000},
        {'month': 'Mar', 'price': 260000},
        {'month': 'Apr', 'price': 265000},
        {'month': 'May', 'price': 270000},
        {'month': 'Jun', 'price': 272000},
        {'month': 'Jul', 'price': 275000},
        {'month': 'Aug', 'price': 278000},
        {'month': 'Sep', 'price': 280000},
        {'month': 'Oct', 'price': 282000},
        {'month': 'Nov', 'price': 285000},
        {'month': 'Dec', 'price': 288000}
    ],
    'property_types': [
        {'type': 'Apartment', 'count': 150},
        {'type': 'House', 'count': 200},
        {'type': 'Condo', 'count': 100},
        {'type': 'Villa', 'count': 50}
    ]
}

# AI Assistant responses
responses = [
    "Based on current trends, the average house price has increased by 15% over the past year.",
    "The most popular property type is houses, followed by apartments.",
    "The market shows strong growth potential in residential properties.",
    "Investment opportunities are particularly good in the downtown area.",
    "Current market analysis suggests it's a good time to invest in real estate."
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/market-data')
def get_market_data():
    return jsonify(market_data)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    return jsonify({'response': random.choice(responses)})

if __name__ == '__main__':
    app.run(debug=True)
