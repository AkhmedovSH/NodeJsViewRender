const express = require('express');
const config = require('../config');
const models = require('../models');
const router = express.Router();

async function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  try {
    const posts = await models.Post.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate('owner')
      .sort({ createdAt: -1 });

    const count = await models.Post.countDocuments();
    res.render('archive/index', {
      posts: {
        // посты найденные в базе
        posts,
        // текущая страница :page
        current: page,
        // общее кол-во страниц
        pages: Math.ceil(count / perPage),
        // постов на странице
        perPage: perPage
      },
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (error) {
    throw new Error('Server Error');
  }
}

router.get('/', (req, res) => posts(req, res));
router.get('/archive/:page', (req, res) => posts(req, res));
router.get('/users/:login/:page*?', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const login = req.params.login;
  const page = req.params.page || 1;

  try {
    const user = await models.User.findOne({ login });
    const posts = await models.Post.find({ owner: user.id })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    const count = await models.Post.countDocuments({ owner: user.id });
    res.render('archive/user', {
      posts: {
        // посты найденные в базе
        posts,
        // текущая страница :page
        current: page,
        // общее кол-во страниц
        pages: Math.ceil(count / perPage),
        // постов на странице
        perPage: perPage
      },
      _user: user,
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (error) {
    throw new Error('Server Error');
  }
});

module.exports = router;
