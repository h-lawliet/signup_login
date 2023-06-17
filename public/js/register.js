'use strict'

// 문서 객체 모델 : 자바스크립트에서 html정보를 가져와 서버로 보내게 해줌.
const id = document.querySelector("#id");
const password = document.querySelector("#password");
const passwordcheck = document.querySelector("#passwordcheck");
const username = document.querySelector("#username");
const phone = document.querySelector("#phone");
const nickname = document.querySelector("#nickname");
const registerbtn = document.querySelector("#registerbtn");
const movetoindex = document.querySelector("#movetoindex");
const movetologin = document.querySelector("#movetologin");

registerbtn.addEventListener('click', register);

movetoindex.addEventListener('click', ()=>{
    location.href = '/';
});

movetologin.addEventListener('click', ()=>{
    location.href = '/login';
});

function register() { // 웹 브라우저에 회원가입 여부를 표시하는 함수
    const req = {
        id: id.value,
        password: password.value,
        passwordcheck: passwordcheck.value,
        username: username.value,
        phone: phone.value,
        nickname: nickname.value
    };
    console.log(req);

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                location.href = '/'; // 회원가입이 성공하면 index로 이동
                alert(res.msg);
            }
            else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("회원가입 에러")); // 에러 처리
        });
};