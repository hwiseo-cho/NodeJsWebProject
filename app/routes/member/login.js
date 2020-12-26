var express = require('express');
var router = express.Router();
var passport = require('passport');



router.get('/', (reqeust, response) => {
    response.render('./member/login', {css: 'login'});
});

// router.post('/signUp', (request, response) => {
//     if(request.body.id === `${user.id}` && request.body.pwd === `${user.pwd}`) {
//         request.session.regenerate(function(err){
//             request.session.logined = true;
//             request.session.id = reqeust.body.id;

//             response.render('home', {session: request.session})
//         });
//     }
//     response.render('home')
// });
router.post('/signUp', passport.authenticate('local', {
    failureRedirect:'/login'
}), (request, response) => {
    response.redirect('/');
})
module.exports = router;