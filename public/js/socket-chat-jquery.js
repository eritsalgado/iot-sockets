let params = new URLSearchParams(window.location.search)

// Referencias
var div_usuarios = $('#divUsuarios');
var form_mensajes = $('#formEnviar');
var txt_mensaje = $('#mensaje');
var div_chatbox = $('#divChatbox');

// Renderizados
function renderUsers( users ){
    console.log(users);

    var html = '';

    html += `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
        </li>
    `;
    
    users.forEach(user => {
        html += `
            <li>
                <a data-id="${user.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${user.nombre} <small class="text-success">online</small></span></a>
            </li>
        `;
    });

    div_usuarios.html(html)
    
}
function renderizarMensaje( data, yo ){
    let html = '';
    let fecha = new Date(data.fecha);
    let hora = `${fecha.getHours()}:${fecha.getMinutes()}`;
    var adminClass = 'info';

    if(data.nombre === 'Server'){
        adminClass = 'danger';
    }

    console.log(data);

    if (yo) {
        html += `
            <li class="reverse animated fadeIn">
                <div class="chat-content">
                    <h5>${data.nombre}</h5>
                    <div class="box bg-light-inverse">${data.mensaje}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${hora}</div>
            </li>
        `;
    }else{
        html += `
            <li class="animated fadeIn">
                <div class="chat-img">${adminClass === 'info' ? '<img src="assets/images/users/1.jpg" alt="user" />' : ''}</div>
                <div class="chat-content">
                    <h5>${data.nombre}</h5>
                    <div class="box bg-light-${adminClass}">${data.mensaje}</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>
        `;
    }
    

    

    div_chatbox.append(html);
}
// Listeners

div_usuarios.on('click', 'a', function(){
    
    var id= $(this).data('id')

    id ? console.log(id) : null;

})

form_mensajes.submit(function(e){
    e.preventDefault();

    let mensaje = txt_mensaje.val()
    
    socket.emit('enviarMensaje', {
        mensaje
    }, function(data){
        txt_mensaje.val('').focus();
        renderizarMensaje(data, true)
        scrollBottom(div_chatbox)
    })
})