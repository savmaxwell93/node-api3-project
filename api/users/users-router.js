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

router.post('/', validateUser, async (req, res, next) => {
  try {
    const newUser = await User.insert(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  try {
    const updated = await User.update(req.params.id, { name: req.name });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
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

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const newPost = await Post.insert({ user_id: req.params.id, text: req.text });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: "Something broke inside users-router",
    message: err.message,
    stack: err.stack
  });
});

module.exports = router;