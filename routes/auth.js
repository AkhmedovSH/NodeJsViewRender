const express = require('express');
const models = require('../models');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();

// POST is authorized
router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены'
    });
  } else {
    bcrypt.hash(password, null, null, (err, hash) => {
      models.User.create({
        login,
        password: hash
      })
        .then(user => {
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.redirect('/');
        })
        .catch(error => {
          res.render('index', { error: error });
        });
    });
  }
});

router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены'
    });
  } else {
    models.User.findOne({
      login
    })
      .then(user => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.redirect('/');
          } else {
            var error = { errmsg: 'Логин или пароль неправильный!' };
            res.render('index', { error: error });
          }
        });
      })
      .catch(error => {
        res.render('index', { error: error });
      });
  }
});

// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
