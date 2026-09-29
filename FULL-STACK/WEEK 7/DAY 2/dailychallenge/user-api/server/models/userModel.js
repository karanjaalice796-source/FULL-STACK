const db = require('../config/database');

const publicColumns = ['id', 'email', 'username', 'first_name', 'last_name', 'created_at'];

async function createUser({ email, username, first_name, last_name, passwordHash }) {
  return db.transaction(async (transaction) => {
    const [user] = await transaction('users')
      .insert({ email, username, first_name, last_name })
      .returning(publicColumns);

    await transaction('hashpwd').insert({ username, password: passwordHash });
    return user;
  });
}

async function getAllUsers() {
  return db('users').select(publicColumns).orderBy('id');
}

async function getUserById(id) {
  return db('users').select(publicColumns).where({ id }).first() || null;
}

async function getUserForLogin(username) {
  return db('users')
    .join('hashpwd', 'users.username', 'hashpwd.username')
    .select('users.id', 'users.email', 'users.username', 'users.first_name', 'users.last_name', 'hashpwd.password')
    .where('users.username', username)
    .first() || null;
}

async function updateUser(id, changes) {
  const { passwordHash, ...profileChanges } = changes;

  return db.transaction(async (transaction) => {
    let user;
    if (Object.keys(profileChanges).length > 0) {
      [user] = await transaction('users')
        .where({ id })
        .update(profileChanges)
        .returning(publicColumns);
    } else {
      user = await transaction('users').select(publicColumns).where({ id }).first();
    }

    if (!user) return null;

    if (passwordHash) {
      await transaction('hashpwd')
        .where({ username: user.username })
        .update({ password: passwordHash });
    }

    return user;
  });
}

module.exports = { createUser, getAllUsers, getUserById, getUserForLogin, updateUser };
