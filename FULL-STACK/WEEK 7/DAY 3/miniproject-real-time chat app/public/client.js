const socket = io();
const entryScreen = document.querySelector('#entry-screen');
const chatScreen = document.querySelector('#chat-screen');
const joinForm = document.querySelector('#join-form');
const usernameInput = document.querySelector('#username');
const roomInput = document.querySelector('#room');
const joinButton = document.querySelector('#join-button');
const joinError = document.querySelector('#join-error');
const messages = document.querySelector('#messages');
const peopleList = document.querySelector('#people-list');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const notificationButton = document.querySelector('#notification-button');
const toast = document.querySelector('#toast');
const connectionState = document.querySelector('#connection-state');
let currentUser = null;
let unreadMessages = 0;
let toastTimer;

function updateJoinButton() {
  joinButton.disabled = !usernameInput.value.trim() || !roomInput.value.trim();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function showChat({ username, room }) {
  currentUser = { username, room };
  entryScreen.hidden = true;
  chatScreen.hidden = false;
  document.querySelector('#sidebar-room').textContent = room;
  document.querySelector('#header-room').textContent = room;
  document.querySelector('#welcome-title').textContent = `Welcome to #${room}`;
  document.querySelector('#message-input').placeholder = `Message #${room}`;
  document.querySelector('#profile-name').textContent = username;
  document.querySelector('#self-avatar').textContent = username.charAt(0).toUpperCase();
  document.title = `#${room} | Commonroom`;
  document.querySelectorAll('.sidebar-room').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.room === room);
  });
  messageInput.focus();
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function renderMessage(message) {
  if (message.type === 'system') {
    const notice = document.createElement('p');
    notice.className = 'system-message';
    notice.textContent = message.text;
    messages.append(notice);
    return;
  }

  const article = document.createElement('article');
  article.className = 'message';
  const avatar = document.createElement('span');
  avatar.className = 'message-avatar';
  avatar.textContent = message.username.charAt(0).toUpperCase();
  const content = document.createElement('div');
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  const name = document.createElement('span');
  name.className = 'message-name';
  name.textContent = message.username;
  const time = document.createElement('time');
  time.className = 'message-time';
  time.dateTime = message.time;
  time.textContent = formatTime(message.time);
  const text = document.createElement('p');
  text.className = 'message-text';
  text.textContent = message.text;
  meta.append(name, time);
  content.append(meta, text);
  article.append(avatar, content);
  messages.append(article);
}

function updatePeople(users) {
  peopleList.replaceChildren();
  document.querySelector('#people-count').textContent = users.length;
  for (const user of users) {
    const person = document.createElement('div');
    person.className = 'person';
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = user.username.charAt(0).toUpperCase();
    const name = document.createElement('span');
    name.className = 'person-name';
    name.textContent = user.username;
    person.append(avatar, name);
    peopleList.append(person);
  }
}

joinForm.addEventListener('input', updateJoinButton);
joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  joinButton.disabled = true;
  joinError.textContent = '';
  socket.emit('room:join', { username: usernameInput.value, room: roomInput.value }, (result) => {
    joinButton.disabled = false;
    if (!result?.ok) {
      joinError.textContent = result?.error || 'Could not join this room.';
      return;
    }
    messages.replaceChildren();
    showChat(result);
  });
});

document.querySelectorAll('[data-room]').forEach((button) => {
  button.addEventListener('click', () => {
    roomInput.value = button.dataset.room;
    document.querySelectorAll('.room-pick').forEach((pick) => {
      pick.classList.toggle('is-selected', pick.dataset.room === button.dataset.room);
    });
    if (currentUser) {
      socket.emit('room:join', { username: currentUser.username, room: button.dataset.room }, (result) => {
        if (result?.ok) {
          messages.replaceChildren();
          showChat(result);
        } else {
          showToast(result?.error || 'Could not switch rooms.');
        }
      });
    }
  });
});

document.querySelector('#leave-button').addEventListener('click', () => {
  socket.emit('room:leave');
  currentUser = null;
  chatScreen.hidden = true;
  entryScreen.hidden = false;
  messages.replaceChildren();
  peopleList.replaceChildren();
  document.querySelector('#people-count').textContent = '0';
  joinError.textContent = '';
  document.title = 'Commonroom | Live chat';
  updateJoinButton();
});

messageInput.addEventListener('input', () => {
  sendButton.disabled = !messageInput.value.trim();
  messageInput.style.height = 'auto';
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 140)}px`;
});
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (!sendButton.disabled) messageForm.requestSubmit();
  }
});
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  sendButton.disabled = true;
  socket.emit('chat:send', { text }, (result) => {
    if (!result?.ok) showToast(result?.error || 'Message could not be sent.');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    messageInput.focus();
  });
});

socket.on('room:history', (history) => {
  messages.replaceChildren();
  history.forEach(renderMessage);
  messages.scrollTop = messages.scrollHeight;
});
socket.on('chat:message', (message) => {
  renderMessage(message);
  messages.scrollTop = messages.scrollHeight;
  if (message.type === 'user' && message.username !== currentUser?.username) {
    showToast(`${message.username} sent a message`);
    if (document.hidden) {
      unreadMessages += 1;
      document.title = `(${unreadMessages}) #${currentUser.room} | Commonroom`;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Message in #${currentUser.room}`, { body: `${message.username}: ${message.text}` });
      }
    }
  }
});
socket.on('room:users', updatePeople);
socket.on('connect', () => {
  connectionState.classList.remove('is-offline');
  connectionState.lastChild.textContent = ' Connected';
  if (currentUser) {
    socket.emit('room:join', currentUser, (result) => {
      if (result?.ok) showChat(result);
    });
  }
});
socket.on('disconnect', () => {
  connectionState.classList.add('is-offline');
  connectionState.lastChild.textContent = ' Reconnecting';
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    unreadMessages = 0;
    if (currentUser) document.title = `#${currentUser.room} | Commonroom`;
  }
});
notificationButton.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    showToast('Desktop notifications are not supported in this browser.');
    return;
  }
  const permission = await Notification.requestPermission();
  notificationButton.textContent = permission === 'granted' ? 'Alerts enabled' : 'Alerts unavailable';
  showToast(permission === 'granted' ? 'Desktop alerts are on.' : 'Desktop alerts were not enabled.');
});
