const express = require('express');
const http = require('http');
const path = require('path');
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'story-app-secret';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const users = [];
const stories = [];
const comments = [];
const versions = [];

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function findUserById(userId) {
  return users.find((user) => user.id === userId);
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

function toStoryResponse(story) {
  const author = findUserById(story.authorId);
  return {
    ...story,
    author: author ? sanitizeUser(author) : null,
    contributorIds: story.contributorIds || [],
    commentsEnabled: story.commentsEnabled !== false,
    versionCount: versions.filter((version) => version.storyId === story.id).length,
  };
}

function toCommentResponse(comment) {
  const user = findUserById(comment.userId);
  return {
    ...comment,
    author: user ? sanitizeUser(user) : null,
  };
}

function generateAvatar(username, seed = '') {
  const initials = username
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed || username)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50&size=128&${initials ? `initials=${initials}` : ''}`;
}

function ensureStoryVersion(story) {
  const snapshot = {
    id: randomUUID(),
    storyId: story.id,
    title: story.title,
    content: story.content,
    timestamp: new Date().toISOString(),
  };
  versions.push(snapshot);
  return snapshot;
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}

function authenticate(req, res, next) {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

function canEditStory(user, story) {
  return story.authorId === user.id || (story.contributorIds || []).includes(user.id);
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Story app backend is running.' });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, avatar } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }

  const usernameExists = users.some((user) => user.username.toLowerCase() === String(username).trim().toLowerCase());
  const emailExists = users.some((user) => user.email.toLowerCase() === String(email).trim().toLowerCase());

  if (usernameExists || emailExists) {
    return res.status(409).json({ message: 'Username or email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const newUser = {
    id: randomUUID(),
    username: String(username).trim(),
    email: String(email).trim(),
    password: hashedPassword,
    avatar: avatar || generateAvatar(String(username).trim(), String(email).trim()),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = createToken(newUser);
  res.status(201).json({ token, user: sanitizeUser(newUser) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find((entry) => entry.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValidPassword = await bcrypt.compare(String(password), user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  res.json({ token: createToken(user), user: sanitizeUser(user) });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.get('/api/stories', (req, res) => {
  res.json({ stories: stories.map((story) => toStoryResponse(story)) });
});

app.post('/api/stories', authenticate, (req, res) => {
  const { title, content, description } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const story = {
    id: randomUUID(),
    title: String(title).trim(),
    description: String(description || '').trim(),
    content: String(content),
    authorId: req.user.id,
    contributorIds: [req.user.id],
    commentsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  stories.push(story);
  ensureStoryVersion(story);

  res.status(201).json({ story: toStoryResponse(story) });
});

app.get('/api/stories/:storyId', (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }
  res.json({ story: toStoryResponse(story) });
});

app.patch('/api/stories/:storyId', authenticate, (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (!canEditStory(req.user, story)) {
    return res.status(403).json({ message: 'Only the author or contributors can edit this story.' });
  }

  const { title, content, description, commentsEnabled } = req.body || {};
  if (title) story.title = String(title).trim();
  if (content) story.content = String(content);
  if (description !== undefined) story.description = String(description).trim();
  if (commentsEnabled !== undefined) story.commentsEnabled = Boolean(commentsEnabled);
  story.updatedAt = new Date().toISOString();
  ensureStoryVersion(story);

  io.to(story.id).emit('story:sync', toStoryResponse(story));
  res.json({ story: toStoryResponse(story), version: versions[versions.length - 1] });
});

app.post('/api/stories/:storyId/contributors', authenticate, (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (story.authorId !== req.user.id) {
    return res.status(403).json({ message: 'Only the story author can manage contributors.' });
  }

  const { userId } = req.body || {};
  const contributor = users.find((user) => user.id === userId);
  if (!contributor) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!story.contributorIds.includes(userId)) {
    story.contributorIds.push(userId);
  }

  io.to(story.id).emit('story:sync', toStoryResponse(story));
  res.json({ story: toStoryResponse(story) });
});

app.get('/api/comments/:storyId', (req, res) => {
  const result = comments
    .filter((comment) => comment.storyId === req.params.storyId)
    .map((comment) => toCommentResponse(comment));
  res.json({ comments: result });
});

app.post('/api/comments', authenticate, (req, res) => {
  const { storyId, commentText } = req.body || {};
  const story = stories.find((entry) => entry.id === storyId);

  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (story.commentsEnabled === false) {
    return res.status(403).json({ message: 'Comments are disabled for this story.' });
  }

  if (!commentText || !String(commentText).trim()) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  const comment = {
    id: randomUUID(),
    storyId,
    userId: req.user.id,
    commentText: String(commentText).trim(),
    timestamp: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };

  comments.push(comment);
  io.to(storyId).emit('comment:new', toCommentResponse(comment));
  res.status(201).json({ comment: toCommentResponse(comment) });
});

app.patch('/api/comments/:commentId', authenticate, (req, res) => {
  const comment = comments.find((entry) => entry.id === req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ message: 'Only the comment author can edit it.' });
  }

  const { commentText } = req.body || {};
  if (!commentText || !String(commentText).trim()) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  comment.commentText = String(commentText).trim();
  io.to(comment.storyId).emit('comment:update', toCommentResponse(comment));
  res.json({ comment: toCommentResponse(comment) });
});

app.post('/api/comments/:commentId/react', authenticate, (req, res) => {
  const comment = comments.find((entry) => entry.id === req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  const { type } = req.body || {};
  if (type === 'like') comment.likes += 1;
  if (type === 'dislike') comment.dislikes += 1;
  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Reaction must be like or dislike.' });
  }

  io.to(comment.storyId).emit('comment:update', toCommentResponse(comment));
  res.json({ comment: toCommentResponse(comment) });
});

app.delete('/api/comments/:commentId', authenticate, (req, res) => {
  const comment = comments.find((entry) => entry.id === req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  const story = stories.find((entry) => entry.id === comment.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (comment.userId !== req.user.id && story.authorId !== req.user.id) {
    return res.status(403).json({ message: 'Only the comment author or story author can delete it.' });
  }

  const index = comments.findIndex((entry) => entry.id === comment.id);
  comments.splice(index, 1);
  io.to(comment.storyId).emit('comment:delete', { commentId: comment.id });
  res.json({ success: true });
});

app.get('/api/versions/:storyId', authenticate, (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (story.authorId !== req.user.id) {
    return res.status(403).json({ message: 'Only the story author can access versions.' });
  }

  const storyVersions = versions
    .filter((version) => version.storyId === req.params.storyId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ versions: storyVersions });
});

app.patch('/api/versions/:versionId/restore', authenticate, (req, res) => {
  const version = versions.find((entry) => entry.id === req.params.versionId);
  if (!version) {
    return res.status(404).json({ message: 'Version not found.' });
  }

  const story = stories.find((entry) => entry.id === version.storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  if (story.authorId !== req.user.id) {
    return res.status(403).json({ message: 'Only the story author can restore versions.' });
  }

  story.title = version.title;
  story.content = version.content;
  story.updatedAt = new Date().toISOString();
  io.to(story.id).emit('story:sync', toStoryResponse(story));
  res.json({ story: toStoryResponse(story) });
});

app.get('/api/users/:userId/profile', (req, res) => {
  const user = findUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const createdStories = stories.filter((story) => story.authorId === user.id).length;
  const contributedStories = stories.filter((story) => story.contributorIds.includes(user.id)).length;

  res.json({
    profile: {
      ...sanitizeUser(user),
      storiesCreated: createdStories,
      storiesContributedTo: contributedStories,
    },
  });
});

app.post('/api/story/share', authenticate, (req, res) => {
  const { storyId } = req.body || {};
  const story = stories.find((entry) => entry.id === storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found.' });
  }

  const baseUrl = `http://localhost:${PORT}`;
  const shareUrl = `${baseUrl}/share.html?storyId=${story.id}`;
  res.json({ shareUrl, storyId: story.id });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new Error('Authentication required for socket connections.'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.id);
    if (!user) {
      return next(new Error('User not found.'));
    }
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Invalid token.'));
  }
});

io.on('connection', (socket) => {
  socket.on('story:join', ({ storyId }) => {
    if (!storyId) return;
    socket.join(storyId);
    const story = stories.find((entry) => entry.id === storyId);
    if (story) socket.emit('story:sync', toStoryResponse(story));
  });

  socket.on('story:edit', ({ storyId, title, content, description }) => {
    const story = stories.find((entry) => entry.id === storyId);
    if (!story) return;
    if (!canEditStory(socket.data.user, story)) {
      socket.emit('story:error', { message: 'Only contributors can edit this story.' });
      return;
    }

    if (title) story.title = String(title).trim();
    if (content) story.content = String(content);
    if (description !== undefined) story.description = String(description).trim();
    story.updatedAt = new Date().toISOString();
    ensureStoryVersion(story);
    const payload = toStoryResponse(story);
    io.to(storyId).emit('story:sync', payload);
  });

  socket.on('cursor:move', ({ storyId, x, y }) => {
    const user = socket.data.user;
    if (!storyId || !user) return;
    socket.to(storyId).emit('cursor:move', {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      x,
      y,
    });
  });

  socket.on('story:toggle-comments', ({ storyId, commentsEnabled }) => {
    const story = stories.find((entry) => entry.id === storyId);
    if (!story) return;
    if (story.authorId !== socket.data.user.id) {
      socket.emit('story:error', { message: 'Only the story author can disable comments.' });
      return;
    }

    story.commentsEnabled = Boolean(commentsEnabled);
    io.to(storyId).emit('story:sync', toStoryResponse(story));
  });
});

server.listen(PORT, () => {
  console.log(`Story app listening on http://localhost:${PORT}`);
});
