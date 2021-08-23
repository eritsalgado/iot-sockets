const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const path = require('path');

const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// IO = esta es la comunicacion del backend
// module.exports.io = socketIO(server);
// require('./sockets/socket');

const io = socketIO(server);

io.on("connect", (client) => {
    console.log(`Cliente conectado id: ${client.id}`);

    client.on('mensaje', (data, callback) => {
        client.broadcast.emit('mensaje', data, port);
        console.log(data);
        callback(port);
    })

    client.on("disconnect", () =>{
        console.log(`El cliente: ${client.id} se fué`)
    })
})



server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});