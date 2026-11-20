const jwt = require('jsonwebtoken');
const User = require('../models/User');

function protect(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  let payload;
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured.' });
    }
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  Promise.resolve(
    User.findById(payload.sub).select('_id username displayName role')
  ).then((user) => {
    if (!user || user.role !== payload.role) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      role: user.role
    };
    return next();
  }).catch(next);
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    return next();
  };
}

module.exports = { protect, allowRoles };
