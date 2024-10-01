const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@hiveio/dhive');

const app = express();
app.use(bodyParser.json());

// Hive setup
const client = new Client('https://api.hive.blog');

// Example route to get blockchain data
app.get('/api/blockchain-info', async (req, res) => {
  try {
    const props = await client.database.getDynamicGlobalProperties();
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
