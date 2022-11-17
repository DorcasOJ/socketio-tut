// const path = require("path");
// const express = require("express");
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// let port = 3000

// app.use(express.static(path.join(__dirname, 'client')));

// io.on('connection', (socket) => {
//     console.log('connected to', socket.id)
// })
// server.listen(port, ()=> console.log(`listening on port ${port}`));


const {instrument} = require('@socket.io/admin-ui');
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', 'https://admin.socket.io/'],
    }
})

io.on("connection", socket => {
    console.log(socket.id)
    socket.on('send-message', (message, room) => {
        if(room === '') {
            socket.broadcast.emit('receive-message',message)
        } else {
            socket.to(room).emit('receive-message', message)
        }
    })
    socket.on('join-room', (room, cb) => {
        socket.join(room)
        cb(`Joined ${room}`)
    })
    socket.on('ping', n=> console.log(n))
})



instrument(io, {auth: false})

const userIo = io.of('/user')
userIo.use((socket, next) => {
    if(socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token)
        next()
    } else {
        next(new Error('Please send Token'))
    }
})

function getUsernameFromToken(token) {
    return token;
}

userIo.on('connection', socket => {
    console.log('connected to the user namespace', + socket.username)
})
