const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`User API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
