const express = require('express');

const User = require('./users-model');
const Post = require('../posts/posts-model');
const { validatePost, validateUser, validateUserId } = require('../middleware/middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.get('/:id', validateUserId, async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const posts = await User.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: "Something broke inside users-router",
    message: err.message,
    stack: err.stack
  });
});

module.exports = router;