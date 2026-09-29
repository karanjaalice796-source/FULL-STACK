const express = require('express');
const { ensurePostsTable } = require('./server/models/postModel');
const postsRoutes = require('./server/routes/postsRoutes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/posts', postsRoutes);

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
  ensurePostsTable()
    .then(() => {
      app.listen(port, () => {
        console.log(`Blog API listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Could not connect to PostgreSQL or initialize posts table:', error.message);
      process.exitCode = 1;
    });
}

module.exports = app;
