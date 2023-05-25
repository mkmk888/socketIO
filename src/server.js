import express from "express";
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";

const app = express();
const port = 5000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(cors());
app.use("/public", express.static(__dirname + "/public")); //퍼블릭 폴더 유저에게 공개

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/*", (req, res) => {
    res.redirect("/");
})


const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
});

instrument(io, {
    auth: false,
    mode: "development",
  });

const sockets = [];

function publicRooms() {
    const sids = io.sockets.adapter.sids;
    const rooms = io.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName) {
    if (io.sockets.adapter.rooms.get(roomName)) {
        return io.sockets.adapter.rooms.get(roomName).size
    } else {
        return undefined;
    }
}

io.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    io.sockets.emit("room_change", publicRooms());
    // 연결시 룸 리스트 새로고침 - 실시간 리스트 새로고침
    socket.on("enter_room", (roomName) => {
        socket.join(roomName);
        io.to(roomName).emit("welcome", socket.nickname,countRoom(roomName)); // 본인제외
        io.sockets.emit("room_change", publicRooms());
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    })
    socket.on("disconnect", () => {
        io.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    })
    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
})

httpServer.listen(port, () => {
    console.log(`app listening on port ${port}`);
});