const express = require('express');
const models = require('../models');
var TurndownService = require('turndown');
const router = express.Router();

router.get('/add', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  res.render('post/add', {
    user: {
      id: userId,
      login: userLogin
    }
  });
});

router.get('/single/:slug', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  models.Post.findOne({ slug: req.params.slug })
    .populate('owner', 'login')
    .then(post => {
      res.render('post/single', {
        post,
        user: {
          id: userId,
          login: userLogin
        }
      });
    });
});

router.post('/add', (req, res) => {
  const userId = req.session.userId;
  const login = req.session.userLogin;
  const title = req.body.title;
  const body = req.body.body;
  if (!userId && !userLogin) {
    res.redirect('/');
  } else {
    var turndownService = new TurndownService();
    models.Post.create({
      title,
      body: turndownService.turndown(body),
      owner: userId
    }).then(response => {
      backURL = req.header('Referer') || '/';
      res.redirect(backURL);
    });
  }
});

module.exports = router;
