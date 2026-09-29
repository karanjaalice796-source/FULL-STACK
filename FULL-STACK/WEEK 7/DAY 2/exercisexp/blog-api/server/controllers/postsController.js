const postModel = require('../models/postModel');

function parsePostId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('Post id must be a positive integer');
    error.status = 400;
    throw error;
  }
  return id;
}

function readPostBody(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!title || !content) {
    const error = new Error('title and content are required');
    error.status = 400;
    throw error;
  }
  return { title, content };
}

async function listPosts(req, res) {
  res.json(await postModel.getAllPosts());
}

async function getPost(req, res) {
  const post = await postModel.getPostById(parsePostId(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

async function createPost(req, res) {
  const post = await postModel.createPost(readPostBody(req.body || {}));
  res.status(201).json(post);
}

async function updatePost(req, res) {
  const post = await postModel.updatePost(
    parsePostId(req.params.id),
    readPostBody(req.body || {}),
  );
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

async function deletePost(req, res) {
  const deleted = await postModel.deletePost(parsePostId(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Post not found' });
  res.status(204).end();
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
