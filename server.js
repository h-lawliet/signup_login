const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbconfig = require("./dbconfig.json");

// DB 연결
const mysql = require('mysql2');
const pool = mysql.createPool({ // mysql 연결
    connectionLimit: 20,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database, 
    debug: false
});

// view engine을 ejs로 설정
app.set('view engine', 'ejs');
// 경로 지정, 나중에 파일을 불러올 때 ./views를 안적어도 된다.
app.set('views', './views');
// __dirname : server.js가 있는 폴더 위치 반환. signuplogin 내의 public폴더를 정적경로로 추가
app.use(express.static(`${__dirname}/public`));
// body-parser 미들웨어
app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({extended: true}));

// get api
app.get('/', (req, res)=>{
    res.render('index');
});
app.get('/login', (req, res)=>{ // 로그인 화면
    res.render('login');
});
app.get('/register', (req, res)=>{
    res.render('register');
});

// POST_login
app.post('/login', (req, res)=>{
    const paramid = req.body.id;
    const parampassword = req.body.password;

    pool.getConnection((error, connection)=>{
        if (error) {
            connection.release();
            console.log('Mysql Connection Error');
            return;
        };

        const exec = connection.query('select id, password from users where id=? and password=?;',
            [paramid, parampassword],
            (err, rows)=>{
                connection.release();
                console.log('실행된 sql 쿼리: '+exec.sql);

                if (err) {
                    console.log('SQL 실행시 오류 발생');
                    console.dir(err);
                    return;
                }

                if (rows.length) {
                    console.log('일치하는 데이터 있음');
                    return res.json({
                        success: true
                    });
                }

                else {
                    console.log('일치하는 정보가 없음');
                    return res.json({
                        success: false,
                        msg: '일치하는 정보가 없습니다'
                    });
                }
            });
    });
});

// POST_register
app.post('/register', (req, res)=>{
    const paramid = req.body.id;
    const parampassword = req.body.password;
    const parampasswordcheck = req.body.passwordcheck;
    const paramname = req.body.username;
    const paramphone = req.body.phone;
    const paramnickname = req.body.nickname;

    pool.getConnection((error, connection)=>{ // connection : DB와의 연결끈
        
        if (parampassword == parampasswordcheck) {
            if (error) {
                connection.release();
                console.log('Mysql Connection Error');
                return;
            }
            // 커넥션을 통해 쿼리를 써준다. password(?)는 mysql내에서 저장된 문자열을 암호화하는 함수이다.
            const exec = connection.query('insert into users (id, password, username, phone, nickname) values (?, ?, ?, ?, ?);', [paramid, parampassword, paramname, paramphone, paramnickname],
                (err, result)=>{
                connection.release();
                console.log('실행된 SQL: '+exec.sql);

                if (err) {
                    console.log('SQL 실행시 오류 발생');
                    console.dir(err);
                    return;
                }

                if (result) {
                    console.dir(result);
                    console.log('insert 성공');
                    return res.json({
                        success: true,
                        msg: '회원가입이 완료되었습니다'
                    })
                    // 회원가입 성공 답변
                    
                }
                else {
                    console.log('insert 실패')
                    return res.json({
                        success: false,
                        msg: '회원가입 실패'
                    })
                }
            });
        }
        else {
            return res.json({
                success: false,
                msg: '비밀번호를 확인해주세요'
            })
        }
    });

});
// 서버 가동
app.listen(3000, ()=>{
    console.log("서버 가동 _ PORT : 3000");
});