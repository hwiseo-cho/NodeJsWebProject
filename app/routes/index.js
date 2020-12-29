var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(request, response, next) {
//   response.render('index', { title: 'Express' });
// });

router.get('/', (request, response) => {
  response.render('home',{loginUser:request.user});
}) 

module.exports = router;
