const socket = io(); //연결
const welcome = document.querySelector("#welcome");
const roomnameForm = document.querySelector("#roomname");
const room = document.querySelector("#room");
const nicknameForm = document.querySelector("#nickname");
const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const cameraSelect = document.querySelector("#cameras");

room.hidden = true;

let roomName;
let roomCount = 0;
let myStream;
let mute = false;
let cameraOff = false;
let myPeerConnection;

async function getCameras(){
    try {
        const devices = navigator.mediaDevices.enumerateDevices();
        const cameras = (await devices).filter((device) => device.kind === "videoinput");
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            cameraSelect.appendChild(option);
        })
    } catch(e) {
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints = {
        audio : true,
        viedo : {facingMode : "user"},
    };
    const cameraConstraints = {
        audio : true,
        video : {deviceId: {exact : deviceId}},
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    } catch(e){
        console.log(e);
    }
}

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
    h3.innerText = `Room : ${roomName}`;
}

async function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    changeRoomTitle();
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit",handleMessageSubmit);
    await getMedia();
    makeConnection();
}

async function handleRoomSubmit(event){
    event.preventDefault();
    const input = roomnameForm.querySelector("#roomname input");
    roomName = input.value;
    await showRoom();
    socket.emit("enter_room",input.value); //이벤트, 변수1234, 함수 순서
    input.value = "";
}

function handleMuteClick(){
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
    })
    if(!mute){
        muteBtn.innerText = "Unmute";
        mute = true;
    } else {
        muteBtn.innerText = "Mute";
        mute = false;
    }
}

function handleCameraClick(){
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
    })
    if(cameraOff){
        cameraBtn.innerText = "Camera Turn Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Camera Turn On";
        cameraOff = true;
    }
}

async function handleCameraChange(){
    await getMedia(cameraSelect.value);
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection.getSenders().find((sender) => sender.track.kind === "video");
        console.log(myPeerConnection.getSenders());
        videoSender.replaceTrack(videoTrack);
    }
    if (mute) {
        myStream.getAudioTracks().forEach((track) => (track.enabled = false));
        } else {
        myStream.getAudioTracks().forEach((track) => (track.enabled = true));
        }
}

roomnameForm.addEventListener("submit",handleRoomSubmit);
nicknameForm.addEventListener("submit",handleNicknameSubmit);
muteBtn.addEventListener("click",handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick);
cameraSelect.addEventListener("input",handleCameraChange);




socket.on("welcome",async (nickname) => {
    addMessage(`${nickname} joined!`);
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer",offer,roomName);
    console.log("sent offer");
});

socket.on("bye",(nickname) => {
    addMessage(`${nickname} left.`);
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

socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
    console.log("received answer");
}) //offer -> offer , answer <- answer


socket.on("offer", async (offer) => {
    console.log("received offer");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer",answer,roomName);
    console.log("sent answer");
});
socket.on("ice",(ice) => {
    myPeerConnection.addIceCandidate(ice);
    console.log("received candidate");
})

//WebRTC
function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream",handleAddStream);
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data){
    socket.emit("ice",data.candidate, roomName);
    console.log("sent candidate");
}
function handleAddStream(data){
    const peerStream = document.querySelector("#peerStream");
    peerStream.srcObject = data.stream;
}