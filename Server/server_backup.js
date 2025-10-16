const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, '../client')));

// Use Pug (Jade) as the view engine and point to the client folder for views
app.set('views', path.join(__dirname, '../client'));
app.set('view engine', 'pug');

// For all GET requests, render the index.pug template
app.get('*', (req, res) => {
  res.render('index');
});

// Use the PORT from Render or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
