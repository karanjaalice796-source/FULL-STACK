const express = require('express');
const booksRoutes = require('./server/routes/booksRoutes');
const { port } = require('./server/config/booksConfig');

const app = express();

app.use(express.json());
app.use('/api/books', booksRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (!error.status || error.status >= 500) console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : 'Internal server error',
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Book API listening on port ${port}`);
  });
}

module.exports = app;
