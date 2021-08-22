var socket = io()


// var params = new URLSearchParams( window.location.search );
if( !params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function(){
    console.log('conectado al server')
    socket.emit('entrarChat', usuario, function(data){
        // console.log('usuarios conectados', data);
        renderUsers(data)
    })
})
socket.on('disconnect', function() {
    console.log('perdimos conexión con el servidor.')
})

// Enviar información
// socket.emit('enviarMensaje', {
//     usuario:'Erit',
//     mensaje:'Hola mundo!'
// }, function(response){
//     console.log('respuesta server:',response)
// })

// Escuchar información
socket.on('enviarMensaje', function(mensaje){
    // console.log(`Servidor:`, mensaje)
    renderizarMensaje(mensaje, false)
    scrollBottom(div_chatbox)
})

// Usuario entra o sale del chat
socket.on('listaPersona', function(personas){
    renderUsers( personas )
})

// Mensaje privado
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado:', mensaje)
})