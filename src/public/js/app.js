const socket = io(); //연결
const welcome = document.querySelector("#welcome");
const roomnameForm = document.querySelector("#roomname");
const room = document.querySelector("#room");
const nicknameForm = document.querySelector("#nickname");

room.hidden = true;

let roomName;
let roomCount = 0;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const message = input.value;
    socket.emit("new_message",message, roomName, () => {
        addMessage(`You : ${message}`);
    });
    input.value="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = document.querySelector("#nickname input");
    const nickname = input.value;
    socket.emit("nickname",nickname);
}

function changeRoomTitle(){
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName} [${roomCount} people]`;
}

async function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    changeRoomTitle();
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit",handleMessageSubmit);
}

async function handleRoomSubmit(event){
    event.preventDefault();
    const input = roomnameForm.querySelector("#roomname input");
    roomName = input.value;
    await showRoom();
    socket.emit("enter_room",input.value); //이벤트, 변수1234, 함수 순서
    input.value = "";
}

roomnameForm.addEventListener("submit",handleRoomSubmit);
nicknameForm.addEventListener("submit",handleNicknameSubmit);

socket.on("welcome",async (nickname,count) => {
    if(roomCount === 0){
        addMessage(`${nickname} (You) joined!`);
    } else {
        addMessage(`${nickname} joined!`);
    }
    roomCount = count;
    changeRoomTitle();
});
socket.on("bye",(nickname,count) => {
    addMessage(`${nickname} left.`);
    roomCount -= 1;
    changeRoomTitle();
});
socket.on("new_message",(msg) => {
    addMessage(msg);
});
socket.on("room_change",(rooms)=>{
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText=room;
        roomList.appendChild(li);
    })
});