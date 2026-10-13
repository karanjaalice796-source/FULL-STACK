const USERS_KEY = 'little-list-demo-users'
const SESSION_KEY = 'little-list-demo-session'
const PASSWORD_HASH_ITERATIONS = 120_000

function readUsers() {
  const savedUsers = window.localStorage.getItem(USERS_KEY)
  if (!savedUsers) return []

  const users = JSON.parse(savedUsers)
  if (!Array.isArray(users)) {
    throw new Error('Saved demo accounts are invalid. Clear this site’s local data to continue.')
  }
  return users
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

function createId() {
  return window.crypto.randomUUID()
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: PASSWORD_HASH_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(derivedBits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function createSession(user) {
  const session = {
    token: createId(),
    userId: user.id,
  }
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: publicUser(user), token: session.token }
}

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()
  if (normalizedName.length < 2) {
    throw new Error('Please enter a name with at least 2 characters.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid email address.')
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password)) {
    throw new Error('Use at least 8 characters, including uppercase, lowercase, and a number.')
  }
  const users = readUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with that email already exists. Try signing in instead.')
  }

  const salt = createId()
  const user = {
    id: createId(),
    name: normalizedName,
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
  }
  users.push(user)
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return createSession(user)
}

export async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || !password) {
    throw new Error('Enter both your email address and password.')
  }
  const user = readUsers().find((item) => item.email === normalizedEmail)

  if (!user) {
    throw new Error('Email or password is incorrect.')
  }

  const passwordHash = await hashPassword(password, user.salt)
  if (passwordHash !== user.passwordHash) {
    throw new Error('Email or password is incorrect.')
  }
  return createSession(user)
}

export function restoreSession() {
  const savedSession = window.sessionStorage.getItem(SESSION_KEY)
  if (!savedSession) return null

  const session = JSON.parse(savedSession)
  if (
    !session
    || typeof session.token !== 'string'
    || typeof session.userId !== 'string'
  ) {
    throw new Error('Saved demo session is invalid. Sign in again to continue.')
  }

  const user = readUsers().find((item) => item.id === session.userId)
  if (!user) {
    window.sessionStorage.removeItem(SESSION_KEY)
    return null
  }

  return { user: publicUser(user), token: session.token }
}

export function logout() {
  window.sessionStorage.removeItem(SESSION_KEY)
}
