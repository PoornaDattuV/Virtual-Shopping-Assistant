const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

// Product list
const products = [
  { id: 1, name: "Red T-shirt", price: "$25" },
  { id: 2, name: "Blue Jeans", price: "$40" },
  { id: 3, name: "Smart Watch", price: "$90" }
];

// AI response logic
const getAIResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // Greet and show product list
  if (['hi', 'hello', 'hey'].some(word => msg.includes(word))) {
    const productList = products.map(p => `• ${p.name} (${p.price})`).join('\n');
    return `Hi, how can I help you?\nHere are some products you can ask about:\n${productList}`;
  }

  // Purchase confirmation
  if (msg.includes('yes') || msg.includes('i want to buy')) {
    return "Awesome! You can proceed with your purchase or ask me for more product details.";
  }

  // Help command
  if (msg.includes('help')) {
    return "You can ask me about any product like T-shirt, Jeans, Watch, etc.";
  }

  // Product search
  const found = products.find(p =>
    p.name.toLowerCase().split(' ').some(word => msg.includes(word))
  );

  if (found) {
    return `I found a product for you: ${found.name}, priced at ${found.price}. Would you like to purchase it?`;
  }

  return "Sorry, I couldn’t find anything matching your request. Try something else?";
};

// API endpoint
app.post('/api/message', (req, res) => {
  const { message } = req.body;
  const reply = getAIResponse(message);
  res.json({ reply });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

