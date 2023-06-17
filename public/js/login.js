'use strict'

// 문서 객체 모델 : 자바스크립트에서 html정보를 가져와 서버로 보내게 해줌.
const id = document.querySelector("#id");
const password = document.querySelector("#password");
const loginbtn = document.querySelector("#loginbtn");
const movetoregister = document.querySelector("#movetoregister");
const movetoindex = document.querySelector("#movetoindex");

loginbtn.addEventListener('click', login);

movetoregister.addEventListener('click', ()=>{
    location.href = '/register';
});

movetoindex.addEventListener('click', ()=>{
    location.href = '/';
});

function login() {
    const req = {
        id: id.value,
        password: password.value,
    };
    console.log(req);

    // 데이터를 서버로 전달하자 : fetch
    // post api가 만들어져야 한다(현재 get api만 존재)
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                location.href = '/'; // 로그인이 성공하면 index로 이동
            }
            else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("로그인 에러")); // 에러 처리
        });
};