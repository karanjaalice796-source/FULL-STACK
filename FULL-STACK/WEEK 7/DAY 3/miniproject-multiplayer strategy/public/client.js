const API = '/api';
const authScreen = document.querySelector('#auth-screen');
const lobbyScreen = document.querySelector('#lobby-screen');
const gameScreen = document.querySelector('#game-screen');
const authForm = document.querySelector('#auth-form');
const authFeedback = document.querySelector('#auth-feedback');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
let authMode = 'login';
let token = localStorage.getItem('cornerstone-token');
let currentUser = null;
let currentGameId = null;
let pollTimer = null;

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const responseText = await response.text();
  let result;
  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw new Error(`Game server returned a non-JSON response (HTTP ${response.status}). Start it with npm run strategy-game and open its localhost page.`);
  }
  if (!result || typeof result !== 'object') {
    throw new Error(`Game server returned an empty response (HTTP ${response.status}). Start it with npm run strategy-game and open its localhost page.`);
  }
  if (!response.ok) {
    if (response.status === 401 && token) logout(false);
    throw new Error(result.error || `Request failed (HTTP ${response.status})`);
  }
  return result;
}

function showFeedback(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle('is-success', success);
}

function showScreen(screen) {
  authScreen.hidden = screen !== 'auth';
  lobbyScreen.hidden = screen !== 'lobby';
  gameScreen.hidden = screen !== 'game';
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelector('#login-tab').classList.toggle('is-active', mode === 'login');
  document.querySelector('#register-tab').classList.toggle('is-active', mode === 'register');
  document.querySelector('#login-tab').setAttribute('aria-selected', mode === 'login');
  document.querySelector('#register-tab').setAttribute('aria-selected', mode === 'register');
  document.querySelector('#auth-heading').textContent = mode === 'login' ? 'Sign in to play' : 'Join the game';
  document.querySelector('#auth-submit').innerHTML = mode === 'login' ? 'Log in <span>↗</span>' : 'Create account <span>↗</span>';
  passwordInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  showFeedback(authFeedback, '');
}

async function loadCurrentUser() {
  if (!token) return false;
  try {
    const result = await api('/me');
    currentUser = result;
    document.querySelector('#account-name').textContent = result.username;
    document.querySelector('#game-account-name').textContent = result.username;
    showScreen('lobby');
    return true;
  } catch {
    token = null;
    localStorage.removeItem('cornerstone-token');
    return false;
  }
}

function logout(showAuth = true) {
  token = null;
  currentUser = null;
  currentGameId = null;
  localStorage.removeItem('cornerstone-token');
  clearInterval(pollTimer);
  if (showAuth) showScreen('auth');
}

document.querySelector('#login-tab').addEventListener('click', () => setAuthMode('login'));
document.querySelector('#register-tab').addEventListener('click', () => setAuthMode('register'));
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = document.querySelector('#auth-submit');
  submit.disabled = true;
  try {
    if (authMode === 'register') {
      await api('/register', { method: 'POST', body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }) });
      setAuthMode('login');
      passwordInput.value = '';
      showFeedback(authFeedback, 'Account created. Log in to play.', true);
      return;
    }
    const result = await api('/login', { method: 'POST', body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }) });
    token = result.token;
    localStorage.setItem('cornerstone-token', token);
    currentUser = result.user;
    document.querySelector('#account-name').textContent = currentUser.username;
    document.querySelector('#game-account-name').textContent = currentUser.username;
    showScreen('lobby');
  } catch (error) {
    showFeedback(authFeedback, error.message);
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', () => logout());

async function openGame(gameId) {
  currentGameId = gameId;
  document.querySelector('#active-game-code').textContent = gameId;
  showScreen('game');
  await refreshGame();
  clearInterval(pollTimer);
  pollTimer = setInterval(refreshGame, 1800);
}

document.querySelector('#create-game').addEventListener('click', async () => {
  const button = document.querySelector('#create-game');
  button.disabled = true;
  try {
    const { game } = await api('/games', { method: 'POST', body: '{}' });
    showFeedback(document.querySelector('#create-feedback'), `Game ${game.id} is ready to join.`, true);
    await openGame(game.id);
  } catch (error) {
    showFeedback(document.querySelector('#create-feedback'), error.message);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#join-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const code = document.querySelector('#game-code').value.trim().toUpperCase();
  try {
    const { game } = await api(`/games/${encodeURIComponent(code)}/join`, { method: 'POST', body: '{}' });
    await openGame(game.id);
  } catch (error) {
    showFeedback(document.querySelector('#join-feedback'), error.message);
  }
});

document.querySelector('#copy-code').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentGameId);
    document.querySelector('#copy-code').textContent = 'Copied';
    setTimeout(() => { document.querySelector('#copy-code').textContent = 'Copy'; }, 1200);
  } catch {
    showFeedback(document.querySelector('#game-feedback'), `Share game code: ${currentGameId}`);
  }
});

function isAdjacent(position, base) {
  return Math.abs(position.x - base.x) + Math.abs(position.y - base.y) === 1;
}

function renderPlayerCard(target, player, marker, isOpponent) {
  target.replaceChildren();
  const icon = document.createElement('span');
  icon.className = `player-marker${isOpponent ? ' opponent' : ''}`;
  icon.textContent = marker;
  const text = document.createElement('span');
  text.append(document.createTextNode(player?.username || 'Waiting for player'));
  const role = document.createElement('small');
  role.textContent = player ? `Base ${marker}` : 'Join with the code above';
  text.append(role);
  target.append(icon, text);
}

function renderBoard(game) {
  const board = document.querySelector('#board');
  const fragment = document.createDocumentFragment();
  const me = game.players.find((player) => player.userId === currentUser.id);
  const opponent = game.players.find((player) => player.userId !== currentUser.id);
  for (let y = 0; y < game.size; y += 1) {
    for (let x = 0; x < game.size; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      const obstacle = game.obstacles.some((item) => item.x === x && item.y === y);
      if (obstacle) cell.classList.add('obstacle');
      if (game.players[0].base.x === x && game.players[0].base.y === y) cell.classList.add('base-a');
      if (game.players[1]?.base.x === x && game.players[1].base.y === y) cell.classList.add('base-b');
      if (me.position.x === x && me.position.y === y) cell.classList.add('player-a');
      if (opponent?.position.x === x && opponent.position.y === y) cell.classList.add('player-b');
      const labels = [];
      if (game.players[0].base.x === x && game.players[0].base.y === y) labels.push(`${game.players[0].username}'s base`);
      if (game.players[1]?.base.x === x && game.players[1].base.y === y) labels.push(`${game.players[1].username}'s base`);
      if (me.position.x === x && me.position.y === y) labels.push('your unit');
      if (opponent?.position.x === x && opponent.position.y === y) labels.push('opponent unit');
      if (obstacle) labels.push('obstacle');
      cell.setAttribute('aria-label', labels.join(', ') || `Open tile ${x + 1}, ${y + 1}`);
      fragment.append(cell);
    }
  }
  board.replaceChildren(fragment);
}

function renderGame(game) {
  const me = game.players.find((player) => player.userId === currentUser.id);
  const opponent = game.players.find((player) => player.userId !== currentUser.id);
  if (!me) {
    logout();
    return;
  }
  renderBoard(game);
  renderPlayerCard(document.querySelector('#player-card-one'), game.players[0], 'A', game.players[0].userId !== currentUser.id);
  renderPlayerCard(document.querySelector('#player-card-two'), game.players[1] || null, 'B', game.players[1]?.userId !== currentUser.id);
  const turn = document.querySelector('#turn-indicator');
  const isMyTurn = game.status === 'active' && game.currentTurn === currentUser.id;
  turn.classList.toggle('is-yours', isMyTurn);
  turn.classList.toggle('is-finished', game.status === 'finished');
  turn.lastChild.textContent = game.status === 'waiting' ? ' Waiting' : game.status === 'finished' ? ' Finished' : isMyTurn ? ' Your turn' : ` ${opponent?.username}'s turn`;
  document.querySelector('#game-status').textContent = game.status === 'waiting' ? 'WAITING FOR PLAYER' : game.status === 'finished' ? 'GAME COMPLETE' : isMyTurn ? 'YOUR TURN TO MOVE' : 'OPPONENT IS MOVING';
  document.querySelector('#game-title').textContent = game.status === 'finished' ? (game.winner.userId === currentUser.id ? 'Victory is yours.' : `${game.winner.username} takes the field.`) : 'The field';
  document.querySelector('#orders-title').textContent = game.status === 'waiting' ? 'Waiting for opponent' : game.status === 'finished' ? (game.winner.userId === currentUser.id ? 'Base captured.' : 'Your base was taken.') : isMyTurn ? 'Make your move' : 'Opponent’s turn';
  document.querySelector('#orders-copy').textContent = game.status === 'waiting' ? 'Share the game code so another player can join.' : game.status === 'finished' ? `${game.winner.username} won this match.` : isMyTurn ? 'Move one square, or attack a neighboring base.' : 'The board will update when they move.';
  document.querySelectorAll('[data-direction]').forEach((button) => { button.disabled = !isMyTurn; });
  document.querySelector('#attack-button').disabled = !isMyTurn || !opponent || !isAdjacent(me.position, opponent.base);
  if (game.status === 'finished') clearInterval(pollTimer);
}

async function refreshGame() {
  if (!currentGameId || !token) return;
  try {
    const { game } = await api(`/games/${currentGameId}`);
    renderGame(game);
  } catch (error) {
    if (error.message !== 'Invalid or expired login token') showFeedback(document.querySelector('#game-feedback'), error.message);
  }
}

async function performAction(path, body, button) {
  if (!currentGameId) return;
  button.disabled = true;
  showFeedback(document.querySelector('#game-feedback'), '');
  try {
    const { game } = await api(`/games/${currentGameId}/${path}`, { method: 'POST', body: JSON.stringify(body) });
    renderGame(game);
  } catch (error) {
    showFeedback(document.querySelector('#game-feedback'), error.message);
    await refreshGame();
  }
}

document.querySelectorAll('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => performAction('moves', { direction: button.dataset.direction }, button));
});
document.querySelector('#attack-button').addEventListener('click', (event) => performAction('attack', {}, event.currentTarget));

function returnToLobby() {
  clearInterval(pollTimer);
  currentGameId = null;
  showScreen('lobby');
}
document.querySelector('#game-lobby-button').addEventListener('click', returnToLobby);
document.querySelector('#return-lobby').addEventListener('click', returnToLobby);

setAuthMode('login');
loadCurrentUser();
