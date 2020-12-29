var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var con = require('./mysql');
var cookie = require('cookie');

var user = {
    id:'user',
    pwd:'1234'
}

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    console.log(user);
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pwd',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
  }, (id, password, done) => {
    con.query(`SELECT ID, PWD FROM MEMBER WHERE ID=? AND PWD=?`,[id,password], (err,result) => {
      console.log(result[0].ID)
      if(id === result[0].ID) {
          if(password === result[0].PWD) {
            return done(null, id);
          } else {
            return done(null, false, {message:"Incoreect password"});
          }
      } else {
          return done(null, false, {message:"Incoreect userName"});
      }
    });
  }));
};