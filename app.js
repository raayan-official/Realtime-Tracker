const express = require ('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);


    socket.on('send-location', (data) => {
        console.log(`Sending location to all clients: ${socket.id}`, data);
       
        io.emit('receive-location', { id: socket.id, ...data });
    });


    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', socket.id);
    });
});

app.get("/", function(req, res){
    res.render('index');
});

server.listen(3000,()=>{
    console.log("server has been started");
})