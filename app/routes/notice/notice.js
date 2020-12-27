const { request } = require('express');
var express = require('express');
var router = express.Router();
var con = require('../../config/mysql');
var moment = require('moment');
var dateFormat = require('dateformat');

router.get('/', (request, response) => {
    response.redirect('/notice/1');
});

// list 불러오기
router.get('/:page', (request, response) => {
    var currentPage = request.params.page;
    con.query(`SELECT COUNT(*) AS COUNT FROM NOTICE`, (error, pageCount) => {
        con.query(`SELECT @ROWNUM := @ROWNUM+1 AS ROWNUM,N.*
                    FROM NOTICE N,(SELECT @ROWNUM := 0) NMP
                    ORDER BY ROWNUM DESC`, function(error, result){
                        console.log(pageCount[0].COUNT)
            for(var i in result) {
                var temp = result[i].CREATEDATE.toString();
                result[i].CREATEDATE = dateFormat(temp,'yyyy-mm-dd');
            }
            var noticeSize = 10;
            var limit = 5;
            var pagecount = pageCount;

            if(currentPage <= 0) {
                pagecount = 0;
                currentPage = 1;
            } else {
                pagecount = (currentPage-1)*noticeSize;
            }
            if(totalRowCount < 0) totalRowCount = 0;
            let totalPage = Math.ceil(totalRowCount/noticeSize);
            if(totalPage < currentPage) {
                pagecount = 0;
                currentPage = 1;
            }
            let startPage = ((currentPage -1)*limit)+1;
            let endPage = (startPage + limit)-1;
            let pagination = {
                "currentPage": currentPage,
                "limit":limit,
                "noticeSize":noticeSize,
                "totalPage":totalPage,
                "startPage":startPage,
                "endPage":endPage,
                "pageCount":pagecount
            }
            response.render('./notice/notice', {rows:result, pagination:pagination});
        });
    });
});

// 등록 페이지로 가기
router.get('/goInsertNotice', (request, response) => {
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
            console.log(err);
        } else {
            response.redirect('/notice');
        }
    });
});

// 삭제 하기
router.post('/deleteNotice', (request, response) => {
    var nno = request.body.nno;
    console.log(nno);
    con.query('DELETE FROM NOTICE WHERE NNO = ?',[nno], (err,result) => {
        if(err) {

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

        } else {
            response.render('./notice/noticeDetail', {row:result});
        }
    });
});
// 수정 페이지 가기
router.get('/goUpdateNotice/:title', (request, response) => {
    var title = request.params.title;
    console.log(title);
    con.query('SELECT * FROM NOTICE WHERE TITLE=?',[title], (err, result) => {
        if(err) {

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
            console.log(err);
        } else {
            response.redirect(`/notice/detail/${title}`);
        }
    });
});
module.exports = router;