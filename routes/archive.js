const express = require('express');
const config = require('../config');
const models = require('../models');
const router = express.Router();

function posts(req,res){
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1

    models.Post.find({}).skip(perPage * page - perPage).limit(perPage)
    .then(posts => {
        models.Post.countDocuments().then(count => {
            res.render('index', {
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
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
}


router.get('/', (req, res) => posts(req,res));
router.get('/archive/:page', (req, res) => posts(req,res));


module.exports = router;