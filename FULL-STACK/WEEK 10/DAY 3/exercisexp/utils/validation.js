function validateRegistration({ username, email, password }) {
  const errors = [];

  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    errors.push('Username must be 3-20 characters: letters, numbers, underscores only.');
  }
  if (!isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }
  errors.push(...passwordErrors(password));

  return errors;
}

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordErrors(password) {
  const errors = [];
  if (typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
    return errors;
  }
  if (password.length > 72) errors.push('Password must be at most 72 characters (bcrypt limit).');
  if (!/[a-z]/.test(password)) errors.push('Password needs a lowercase letter.');
  if (!/[A-Z]/.test(password)) errors.push('Password needs an uppercase letter.');
  if (!/[0-9]/.test(password)) errors.push('Password needs a number.');
  return errors;
}

module.exports = { validateRegistration, isValidEmail, passwordErrors };
