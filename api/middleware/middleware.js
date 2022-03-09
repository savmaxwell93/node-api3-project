const User = require('../users/users-model');

function logger(req, res, next) {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toLocaleString();
  console.log(`Logger: ${timestamp} ${method} to ${url}`);
  next();
}

function validateUserId(req, res, next) {
  User.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: `user not found`});
      } else {
        req.user = user;
        next();
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ message: "missing required name field"});
  } else {
    req.name = name.trim();
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ message: "missing required text field"});
  } else {
    req.text = text.trim();
    next();
  }
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}