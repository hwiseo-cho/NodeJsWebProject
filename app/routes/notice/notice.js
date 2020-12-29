var express = require('express');
var router = express.Router();
var con = require('../../config/mysql');
var moment = require('moment');
var dateFormat = require('dateformat');

var changeDateList = function(result) {
    for(var i in result) {
        var temp = result[i].CREATEDATE.toString();
        result[i].CREATEDATE = dateFormat(temp,'yyyy-mm-dd');
    }
}
var changeDate = function(result) {
    var temp = result[0].CREATEDATE.toString();
    result[0].CREATEDATE = dateFormat(temp,'yyyy-mm-dd');
}

// list 불러오기
router.get('/', (request, response) => {
    con.query(`SELECT COUNT(*) AS COUNT FROM NOTICE`, (error, pageCount) => {
        con.query(`SELECT @ROWNUM := @ROWNUM+1 AS ROWNUM,N.*
                    FROM NOTICE N,(SELECT @ROWNUM := 0) NMP
                    ORDER BY ROWNUM DESC`, function(error, result){
            changeDateList(result);
            response.render('./notice/notice', {rows:result});
        });
    });
    
});
// let noticeLimit = 10; 
// let limit = 5; 
// pageCount;
// if (totalRowCount < 0) {
//     totalRowCount = 0; 
// } 
// let totalPage = Math.ceil(totalRowCount / noticeLimit);
// if(currentPage <= 0) {
//     pageCount = 0;
//     currentPage = 1;
// } 
// if(totalPage < currentPage) {
//     pageCount = 0;
//     currentPage = 1;
// }
// let startPage = ((curSet - 1) * limit) + 1;
// let endPage = (startPage + page_list_size) - 1;
// let result = { "currentPage": currentPage, "limit": limit, "noticeLimit": noticeLimit, "totalPage": totalPage, "startPage": startPage, "endPage": endPage, "pageCount": pageCount };


// 등록 페이지로 가기
router.get('/insertForm', (request, response) => {
    response.render('./notice/noticeInsertForm');
});
// 등록 후 돌아가기
router.post('/insertNotice', (request, response) => {
    var title = request.body.title;
    var content = request.body.content;
    var createdate = request.body.createdate;
    if(createdate === undefined || createdate === '') {
        createdate = moment().format('YYYY-MM-DD');
    }
    var author = 'admin';
    con.query('insert into notice (title, content, createdate, author) values (?,?,?,?)',
    [title,content,createdate,author], (err, result) => {
        if(err) {
            throw err;
        } else {
            response.redirect('/notice');
        }
    });
});

// 삭제 하기
router.post('/deleteNotice', (request, response) => {
    var nno = request.body.nno;
    con.query('DELETE FROM NOTICE WHERE NNO = ?',[nno], (err,result) => {
        if(err) {
            throw err;
        } else {
            response.json(1);
        }
    });
});

// 디테일 페이지로 가기
router.get('/detail/:title', (request, response) => {
    var title = request.params.title;
    console.log(title);
    con.query('SELECT * FROM NOTICE WHERE TITLE=?',[title], (err, result) => {
        if(err) {
            throw err;
        } else {
            changeDate(result);
            response.render('./notice/noticeDetail', {row:result});
        }
    });
});
// 수정 페이지 가기
router.get('/goUpdateNotice/:title', (request, response) => {
    var title = request.params.title;
    con.query('SELECT * FROM NOTICE WHERE TITLE=?',[title], (err, result) => {
        if(err) {
            throw err;
        } else {
            response.render('./notice/noticeUpdateForm', {row:result});
        }
    });
})

// 수정
router.post('/updateNotice', (request, response) => {
    var nno = request.body.nno;
    var title = request.body.title;
    var content = request.body.content;
    var createdate = request.body.createdate;
    if(createdate === undefined || createdate === '') {
        createdate = moment().format('YYYY-MM-DD');
    }
    con.query('UPDATE NOTICE SET TITLE=?,CONTENT=?,CREATEDATE=? WHERE NNO = ?',
    [title,content,createdate,nno], (err, result) => {
        if(err) {
            throw err;
        } else {
            response.redirect(`/notice/detail/${title}`);
        }
    });
});
module.exports = router;