const movetoregister = document.querySelector("#movetoregister");
const movetologin = document.querySelector("#movetologin");

movetoregister.addEventListener('click', ()=>{
    location.href = '/register';
});

movetologin.addEventListener('click', ()=>{
    location.href = '/login';
});