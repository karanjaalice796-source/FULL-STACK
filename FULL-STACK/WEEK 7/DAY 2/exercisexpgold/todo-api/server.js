const express = require('express');
const todoRoutes = require('./server/routes/todoRoutes');

const app = express();
const port = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use('/api/todos', todoRoutes);

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
    console.log(`Todo API listening on port ${port}`);
  });
}

module.exports = app;
