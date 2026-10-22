const app = document.getElementById('app');
const apiBase = '/api';

const state = {
  user: null,
  token: localStorage.getItem('story-app-token') || '',
  stories: [],
  selectedStoryId: null,
  comments: [],
  versions: [],
  mode: 'login',
  socket: null,
  cursorMap: {},
  authMessage: null,
};

function setAuthMessage(type, text) {
  state.authMessage = { type, text };
  render();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

function saveToken(token) {
  state.token = token;
  localStorage.setItem('story-app-token', token);
}

function clearAuth() {
  state.user = null;
  state.token = '';
  localStorage.removeItem('story-app-token');
  render();
}

function getSelectedStory() {
  return state.stories.find((story) => story.id === state.selectedStoryId) || null;
}

async function loadStories() {
  const data = await fetchJson(`${apiBase}/stories`);
  state.stories = data.stories || [];
  if (!state.selectedStoryId && state.stories.length) {
    state.selectedStoryId = state.stories[0].id;
  }
  if (state.selectedStoryId && !state.stories.some((story) => story.id === state.selectedStoryId)) {
    state.selectedStoryId = state.stories[0]?.id || null;
  }
  if (state.selectedStoryId) {
    await loadComments(state.selectedStoryId);
    await loadVersions(state.selectedStoryId);
  }
}

async function loadComments(storyId) {
  const data = await fetchJson(`${apiBase}/comments/${storyId}`);
  state.comments = data.comments || [];
}

async function loadVersions(storyId) {
  const story = getSelectedStory();
  if (!story || !state.user || state.user.id !== story.author?.id) return;
  const data = await fetchJson(`${apiBase}/versions/${storyId}`);
  state.versions = data.versions || [];
}

async function loadCurrentUser() {
  if (!state.token) return;
  try {
    const data = await fetchJson(`${apiBase}/auth/me`);
    state.user = data.user;
    await loadStories();
    connectSocket();
  } catch (error) {
    console.error(error);
    clearAuth();
  }
}

function connectSocket() {
  if (state.socket) {
    state.socket.disconnect();
  }

  state.socket = io({ auth: { token: state.token } });

  state.socket.on('connect', () => {
    if (state.selectedStoryId) {
      state.socket.emit('story:join', { storyId: state.selectedStoryId });
    }
  });

  state.socket.on('story:sync', (story) => {
    state.stories = state.stories.map((item) => item.id === story.id ? story : item);
    render();
  });

  state.socket.on('comment:new', (comment) => {
    state.comments = [...state.comments.filter((item) => item.id !== comment.id), comment];
    render();
  });

  state.socket.on('comment:update', (comment) => {
    state.comments = state.comments.map((item) => item.id === comment.id ? comment : item);
    render();
  });

  state.socket.on('comment:delete', ({ commentId }) => {
    state.comments = state.comments.filter((comment) => comment.id !== commentId);
    render();
  });

  state.socket.on('story:error', ({ message }) => {
    setAuthMessage('error', message);
  });

  state.socket.on('cursor:move', ({ userId, username, avatar, x, y }) => {
    if (!state.selectedStoryId) return;
    state.cursorMap[userId] = { username, avatar, x, y };
    render();
  });
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = {
    username: formData.get('username')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  };

  try {
    const endpoint = state.mode === 'login' ? `${apiBase}/auth/login` : `${apiBase}/auth/register`;
    const data = await fetchJson(endpoint, {
      method: 'POST',
      body: JSON.stringify(state.mode === 'login' ? { email: payload.email, password: payload.password } : payload),
    });

    saveToken(data.token);
    state.user = data.user;
    await loadStories();
    connectSocket();
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function createStory(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = {
    title: formData.get('storyTitle')?.toString() || '',
    description: formData.get('storyDescription')?.toString() || '',
    content: formData.get('storyContent')?.toString() || '',
  };

  try {
    const data = await fetchJson(`${apiBase}/stories`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    state.selectedStoryId = data.story.id;
    await loadStories();
    form.reset();
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function updateSelectedStory(event) {
  event.preventDefault();
  const story = getSelectedStory();
  if (!story) return;

  const formData = new FormData(event.currentTarget);
  const payload = {
    title: formData.get('storyTitle')?.toString() || story.title,
    description: formData.get('storyDescription')?.toString() || story.description,
    content: formData.get('storyContent')?.toString() || story.content,
    commentsEnabled: story.commentsEnabled,
  };

  try {
    const data = await fetchJson(`${apiBase}/stories/${story.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    state.stories = state.stories.map((item) => item.id === story.id ? data.story : item);
    await loadComments(story.id);
    await loadVersions(story.id);
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function addContributor(event) {
  event.preventDefault();
  const story = getSelectedStory();
  const formData = new FormData(event.currentTarget);
  const userId = formData.get('userId')?.toString();
  if (!story || !userId) return;

  try {
    const data = await fetchJson(`${apiBase}/stories/${story.id}/contributors`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    state.stories = state.stories.map((item) => item.id === story.id ? data.story : item);
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function saveComment(event) {
  event.preventDefault();
  const story = getSelectedStory();
  const formData = new FormData(event.currentTarget);
  const commentText = formData.get('commentText')?.toString() || '';
  if (!story || !commentText.trim()) return;

  try {
    await fetchJson(`${apiBase}/comments`, {
      method: 'POST',
      body: JSON.stringify({ storyId: story.id, commentText }),
    });
    event.currentTarget.reset();
    await loadComments(story.id);
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function toggleCommentReaction(commentId, type) {
  const before = state.comments.find((comment) => comment.id === commentId);
  if (!before) return;

  const optimistic = { ...before, [type === 'like' ? 'likes' : 'dislikes']: (before[type === 'like' ? 'likes' : 'dislikes'] || 0) + 1 };
  state.comments = state.comments.map((comment) => comment.id === commentId ? optimistic : comment);
  render();

  try {
    const data = await fetchJson(`${apiBase}/comments/${commentId}/react`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
    state.comments = state.comments.map((comment) => comment.id === commentId ? data.comment : comment);
    render();
  } catch (error) {
    state.comments = state.comments.map((comment) => comment.id === commentId ? before : comment);
    setAuthMessage('error', error.message);
    render();
  }
}

async function deleteComment(commentId) {
  try {
    await fetchJson(`${apiBase}/comments/${commentId}`, {
      method: 'DELETE',
    });
    await loadComments(getSelectedStory()?.id);
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function restoreVersion(versionId) {
  try {
    const data = await fetchJson(`${apiBase}/versions/${versionId}/restore`, {
      method: 'PATCH',
    });
    state.stories = state.stories.map((story) => story.id === data.story.id ? data.story : story);
    await loadComments(data.story.id);
    await loadVersions(data.story.id);
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function createShareLink() {
  const story = getSelectedStory();
  if (!story) return;
  try {
    const data = await fetchJson(`${apiBase}/story/share`, {
      method: 'POST',
      body: JSON.stringify({ storyId: story.id }),
    });
    await navigator.clipboard.writeText(data.shareUrl);
    setAuthMessage('success', 'Share link copied to clipboard.');
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

async function toggleCommentsDisabled() {
  const story = getSelectedStory();
  if (!story || !state.user || state.user.id !== story.author?.id) return;

  try {
    state.socket.emit('story:toggle-comments', { storyId: story.id, commentsEnabled: !story.commentsEnabled });
    await fetchJson(`${apiBase}/stories/${story.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ commentsEnabled: !story.commentsEnabled }),
    });
    await loadStories();
    render();
  } catch (error) {
    setAuthMessage('error', error.message);
  }
}

function handleEditorInput(event) {
  const story = getSelectedStory();
  if (!story || !state.socket) return;

  const content = event.target.value;
  state.socket.emit('story:edit', {
    storyId: story.id,
    title: story.title,
    content,
    description: story.description,
  });
}

function handleEditorCursor(event) {
  const story = getSelectedStory();
  const socket = state.socket;
  if (!story || !socket) return;

  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  socket.emit('cursor:move', { storyId: story.id, x, y });
}

function renderAuth() {
  if (state.user) return null;

  return `
    <div class="auth-shell">
      <div class="panel auth-card">
        <h1>Story Studio</h1>
        <div class="tabs">
          <button class="tab-btn ${state.mode === 'login' ? 'active' : ''}" data-mode="login">Login</button>
          <button class="tab-btn ${state.mode === 'register' ? 'active' : ''}" data-mode="register">Register</button>
        </div>
        ${state.authMessage ? `<div class="message ${state.authMessage.type}">${escapeHtml(state.authMessage.text)}</div>` : ''}
        <form id="auth-form" class="form-grid">
          ${state.mode === 'register' ? `
            <div class="field-row">
              <label>Username</label>
              <input name="username" placeholder="Enter your username" required />
            </div>
          ` : ''}
          <div class="field-row">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="field-row">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" class="primary-btn">${state.mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
      </div>
    </div>
  `;
}

function renderDashboard() {
  if (!state.user) return null;

  const story = getSelectedStory();
  const isAuthor = !!story && state.user.id === story.author?.id;
  const contributorIds = story ? story.contributorIds || [] : [];

  return `
    <div class="dashboard-shell">
      <div class="panel dashboard-header">
        <div>
          <h1>Story Studio</h1>
          <div class="meta">Collaborative writing room</div>
        </div>
        <div class="user-pill">
          <img class="avatar" src="${escapeHtml(state.user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg') }" alt="avatar" />
          <div>
            <strong>${escapeHtml(state.user.username)}</strong><br />
            <span class="meta">${escapeHtml(state.user.email)}</span>
          </div>
          <button class="secondary-btn" id="logout-btn">Logout</button>
        </div>
      </div>

      <div class="layout">
        <aside class="panel sidebar">
          <h2>Your stories</h2>
          <div class="story-list">
            ${state.stories.map((item) => `
              <div class="story-card ${item.id === story?.id ? 'active' : ''}" data-story-id="${item.id}">
                <h3>${escapeHtml(item.title)}</h3>
                <div class="meta">By ${escapeHtml(item.author?.username || 'You')}</div>
                <div class="meta">${escapeHtml(item.versionCount || 0)} versions</div>
              </div>
            `).join('') || '<div class="meta">No stories yet.</div>'}
          </div>

          <form id="story-form" class="inline-form" style="margin-top:20px;">
            <input name="storyTitle" placeholder="Story title" required />
            <input name="storyDescription" placeholder="Short description" />
            <textarea name="storyContent" placeholder="Write your story here..." required></textarea>
            <button type="submit" class="primary-btn">Create story</button>
          </form>
        </aside>

        <main class="panel main-panel">
          ${story ? `
            <div class="story-editor">
              <h2>${escapeHtml(story.title)}</h2>
              <div class="meta">Author: ${escapeHtml(story.author?.username || 'Unknown')} • Contributors: ${contributorIds.length}</div>
              <div class="story-toolbar">
                <button class="secondary-btn" id="share-btn">Share</button>
                ${isAuthor ? `<button class="secondary-btn" id="toggle-comments-btn">${story.commentsEnabled ? 'Disable comments' : 'Enable comments'}</button>` : ''}
              </div>

              <form id="story-edit-form" class="inline-form" style="margin-top: 18px;">
                <input name="storyTitle" value="${escapeHtml(story.title)}" required />
                <input name="storyDescription" value="${escapeHtml(story.description || '')}" />
                <textarea id="story-editor-content" name="storyContent" required>${escapeHtml(story.content || '')}</textarea>
                <button type="submit" class="primary-btn">Save story</button>
              </form>

              <div class="story-preview" id="story-preview">
                ${escapeHtml(story.content || '')}
                ${Object.entries(state.cursorMap).map(([userId, info]) => {
                  const isMe = userId === state.user.id;
                  return `<div class="cursor" style="left:${info.x}px; top:${info.y}px; ${isMe ? 'background:#ff8a4c;' : ''}" title="${escapeHtml(info.username)}"></div>`;
                }).join('')}
              </div>

              ${isAuthor ? `
                <form id="add-contributor-form" class="inline-form" style="margin-top:20px;">
                  <input name="userId" placeholder="Contributor user id" required />
                  <button type="submit" class="secondary-btn">Add contributor</button>
                </form>
              ` : ''}
            </div>

            <div class="comment-panel" style="margin-top:20px;">
              <h3>Comments</h3>
              ${story.commentsEnabled ? `
                <form id="comment-form" class="inline-form">
                  <textarea name="commentText" placeholder="Add a comment..." required></textarea>
                  <button type="submit" class="primary-btn">Post comment</button>
                </form>
              ` : '<div class="meta">Comments are disabled for this story.</div>'}

              <div class="comment-list">
                ${state.comments.length ? state.comments.map((comment) => {
                  const isAuthorOfComment = comment.userId === state.user.id;
                  const canDelete = isAuthorOfComment || state.user.id === story.author?.id;
                  return `
                    <div class="comment-item" data-comment-id="${comment.id}">
                      <div class="comment-header">
                        <strong>${escapeHtml(comment.author?.username || 'User')}</strong>
                        <span class="meta">${new Date(comment.timestamp).toLocaleString()}</span>
                      </div>
                      <div>${escapeHtml(comment.commentText || '')}</div>
                      <div class="reaction-row">
                        <button class="secondary-btn" data-reaction="like" data-comment-id="${comment.id}">👍 ${comment.likes || 0}</button>
                        <button class="secondary-btn" data-reaction="dislike" data-comment-id="${comment.id}">👎 ${comment.dislikes || 0}</button>
                        ${canDelete ? `<button class="danger-btn" data-delete-comment="${comment.id}">Delete</button>` : ''}
                      </div>
                    </div>
                  `;
                }).join('') : '<div class="meta">No comments yet.</div>'}
              </div>
            </div>

            <div class="version-panel" style="margin-top:20px;">
              <h3>Versions</h3>
              ${state.user.id === story.author?.id ? `
                <div class="version-list">
                  ${state.versions.length ? state.versions.map((version) => `
                    <div class="version-item">
                      <div class="version-header">
                        <strong>${new Date(version.timestamp).toLocaleString()}</strong>
                        <button class="secondary-btn" data-restore-version="${version.id}">Restore</button>
                      </div>
                      <div class="meta">${escapeHtml(version.title)}</div>
                    </div>
                  `).join('') : '<div class="meta">No saved versions yet.</div>'}
                </div>
              ` : '<div class="meta">Only the story author can access previous versions.</div>'}
            </div>
          ` : '<div class="meta">Select a story to begin collaborating.</div>'}
        </main>
      </div>
    </div>
  `;
}

function render() {
  app.innerHTML = state.user ? renderDashboard() : renderAuth();

  if (!state.user) {
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.authMessage = null;
        render();
      });
    });

    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', handleAuthSubmit);
    }
    return;
  }

  const storyForm = document.getElementById('story-form');
  if (storyForm) storyForm.addEventListener('submit', createStory);

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', clearAuth);

  document.querySelectorAll('[data-story-id]').forEach((card) => {
    card.addEventListener('click', async () => {
      state.selectedStoryId = card.dataset.storyId;
      if (state.socket) state.socket.emit('story:join', { storyId: state.selectedStoryId });
      await loadComments(state.selectedStoryId);
      await loadVersions(state.selectedStoryId);
      render();
    });
  });

  const storyEditForm = document.getElementById('story-edit-form');
  if (storyEditForm) {
    storyEditForm.addEventListener('submit', updateSelectedStory);
  }

  const storyEditor = document.getElementById('story-editor-content');
  if (storyEditor) {
    storyEditor.addEventListener('input', handleEditorInput);
    storyEditor.addEventListener('mousemove', handleEditorCursor);
  }

  const commentForm = document.getElementById('comment-form');
  if (commentForm) commentForm.addEventListener('submit', saveComment);

  document.querySelectorAll('[data-reaction]').forEach((button) => {
    button.addEventListener('click', () => toggleCommentReaction(button.dataset.commentId, button.dataset.reaction));
  });

  document.querySelectorAll('[data-delete-comment]').forEach((button) => {
    button.addEventListener('click', () => deleteComment(button.dataset.deleteComment));
  });

  document.querySelectorAll('[data-restore-version]').forEach((button) => {
    button.addEventListener('click', () => restoreVersion(button.dataset.restoreVersion));
  });

  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) shareBtn.addEventListener('click', createShareLink);

  const toggleCommentsBtn = document.getElementById('toggle-comments-btn');
  if (toggleCommentsBtn) toggleCommentsBtn.addEventListener('click', toggleCommentsDisabled);

  const addContributorForm = document.getElementById('add-contributor-form');
  if (addContributorForm) addContributorForm.addEventListener('submit', addContributor);
}

window.addEventListener('DOMContentLoaded', async () => {
  if (state.token) {
    await loadCurrentUser();
  } else {
    render();
  }
});
