var express = require('express');
var router = express.Router();
var db = require('../db/api');
var auth = require('../auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        id: req.session.userId
    });
});

router.get('/login', auth.isLoggedIn, (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    auth.passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.render('login', {
                error: err
            });
        } else if (user) {
            req.session.userId = user.id;
            res.redirect('/home')
        }
    })(req, res, next);
})

router.get('/signup', auth.isLoggedIn, (req, res, next) => {
    res.render('signup');
})

router.post('/signup', auth.isLoggedIn, (req, res, next) => {
    db.findUserByUsername(req.body.username).then(id => {
        if (id) {
            res.render('signup', {
                error: "User name is taken"
            })
        } else {
            auth.createUser(req.body).then(id => {
                req.session.userId = id;
                res.render('home');
            })
        }
    }).catch(err => next(err))
})

router.get('/logout', (req, res, next) => {
    req.session = null;
    res.redirect('/')
})

router.get('/home', (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}, (req, res, next) => {
    db.findUserById(req.session.userId).then(user => {
        res.render('home', {
            user: user
        });
    })
});

module.exports = router;
