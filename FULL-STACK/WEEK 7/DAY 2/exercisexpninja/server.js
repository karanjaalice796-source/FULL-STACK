const express = require('express');
const path = require('path');
const questionRoutes = require('./server/routes/questionRoutes');
const { initializeDatabase } = require('./server/models/questionModel');

const app = express();
const port = Number(process.env.PORT) || 3007;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', questionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (!error.status || error.status >= 500) console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : 'Internal server error',
  });
});

async function startServer() {
  await initializeDatabase();
  return app.listen(port, () => {
    console.log(`Quiz server listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start the quiz server:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };