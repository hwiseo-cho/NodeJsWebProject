var express = require('express');
var router = express.Router();
var passport = require('passport');
const { post } = require('..');
const { request } = require('../../../app');
var con = require('../../config/mysql');



router.get('/', (reqeust, response) => {
    response.render('./member/login', {css: 'login'});
});

// 로그인
router.post('/signUp', passport.authenticate('local', {
    failureRedirect:'/login',
    successRedirect:'/'
}));

// 로그아웃
router.get('/logout', (request, response) => {
    request.session.destroy( (err) => {
        response.redirect('/');
    })
});

router.get('/loginForm', (request, response) => {
    response.render('./member/memberInsertForm');
});

// 회원가입
router.post('/memberInsert', (request, response) => {
    var id = request.body.id;
    var pwd = request.body.pwd;
    if(id !== undefined && pwd !== undefined) {
        con.query('INSERT INTO MEMBER(ID,PWD) VALUES(?,?)', [id,pwd], (error, result) => {
            if(error) {
                console.log(error);
            } else {
                response.redirect('/login');
            }
        });
    }
});

module.exports = router;