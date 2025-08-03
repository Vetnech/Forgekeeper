// listener.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});


// Self Ping to check status
const fetch = require('node-fetch');

setInterval(() => {
  fetch('https://forgekeeper.onrender.com').then(() =>
    console.log('🔁 Self-ping finished. Bot is operational.')
  );
}, 5 * 60 * 1000); // every 5 minutes

