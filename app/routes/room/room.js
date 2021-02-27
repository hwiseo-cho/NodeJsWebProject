var express = require('express');
var router = express.Router();
var con = require('../../config/mysql');

// 숙소 전체 불러오기
router.get('/', (request, response) => {
    con.query('SELECT RNO, HNAME, IMAGE, PRICE, CAPA, HCONTENT FROM ROOM', (err, result) => {
        if(err) {
            console.log(err);
        } else {
            for(var i=0; i<result.length; i++) {
                result[i].PRICE = result[i].PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            response.render('./room/roomList', {result:result});
        }
    });
});

// 숙소 상세보기
router.get('/detail/:rno', (request, response) => {
    var rno = request.params.rno;
    con.query(`SELECT * FROM ROOM WHERE RNO=?`,[rno], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            result[0].PRICE = result[0].PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            response.render('./room/roomDetail',{result:result});
        }
    });
});

module.exports = router;