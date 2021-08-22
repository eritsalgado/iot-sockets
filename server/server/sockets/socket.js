const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        
        console.log(data)
        if( !data.nombre || !data.sala ){
            return callback({
                error:true,
                mensaje:'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersona( client.id, data.nombre, data.sala, data.user_id );

        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('enviarMensaje', crearMensaje('Server', `${data.nombre} se unió`))

        callback(usuarios.getPersonasPorSala(data.sala));
    })

    client.on('enviarMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('enviarMensaje', mensaje);
        callback(mensaje);
    })

    client.on('disconnect',()=> {
        let persona_borrada = usuarios.borrarPersona( client.id );
        client.broadcast.to(persona_borrada.sala).emit('enviarMensaje', crearMensaje('Server', `${persona_borrada.nombre} salió`))
        client.broadcast.to(persona_borrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(persona_borrada.sala));
    })

    // Mensaje privado
    client.on('mensajePrivado', data => {
        // Persona que envia el mensaje
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});