var express = require('express');
var router = express.Router();

router.get('/', (request, response) => {
    response.render('./room/roomList');
});

module.exports = router;