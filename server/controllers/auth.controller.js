const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error('JWT_SECRET is not configured.');
    error.statusCode = 500;
    throw error;
  }
  return jwt.sign(
    { role: user.role },
    secret,
    { subject: user._id.toString(), expiresIn: '7d' }
  );
}

async function login(req, res) {
  const { username, password, expectedRole } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (expectedRole && !User.roles.includes(expectedRole)) {
    return res.status(400).json({ message: 'Invalid expectedRole.' });
  }

  const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  if (expectedRole && user.role !== expectedRole) {
    return res.status(403).json({ message: `This portal is for ${expectedRole} accounts.` });
  }

  return res.json({
    token: createToken(user),
    user: {
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      role: user.role
    }
  });
}

async function register(req, res) {
  const { username, password, displayName } = req.body || {};
  if (typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }
  if (typeof displayName !== 'undefined' && typeof displayName !== 'string') {
    return res.status(400).json({ message: 'displayName must be a string.' });
  }

  const user = await User.create({
    username: username.trim().toLowerCase(),
    displayName: typeof displayName === 'string' ? displayName.trim() : '',
    passwordHash: await bcrypt.hash(password, 12),
    role: 'student'
  });

  return res.status(201).json({
    token: createToken(user),
    user: {
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      role: user.role
    }
  });
}

function getMe(req, res) {
  return res.json({ user: req.user });
}

module.exports = { login, register, getMe };
