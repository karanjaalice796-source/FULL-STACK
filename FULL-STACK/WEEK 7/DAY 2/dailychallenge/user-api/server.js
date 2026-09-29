const express = require('express');
const userRoutes = require('./server/routes/userRoutes');

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use('/', userRoutes);

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
    console.log(`User API listening on port ${port}`);
  });
}

module.exports = app;
