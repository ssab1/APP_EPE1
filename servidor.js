const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'png': 'image/png',
  'ico': 'image/x-icon',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4'
};



const servidor = http.createServer((pedido, respuesta) => {
  const objetourl = url.parse(pedido.url);
  let camino = 'web' + objetourl.pathname;
  if (camino == 'web/')
    camino = 'web/index.html';
  encaminar(pedido, respuesta, camino);
});

servidor.listen(8888);


function encaminar(pedido, respuesta, camino) {
  switch (camino) {
    case 'web/validar': {
      validar(pedido, respuesta);
      break;
    }
    case 'web/cargar': {
      grabarComentarios(pedido, respuesta);
      break;
    }
    case 'web/leercomentarios': {
      leerComentarios(respuesta);
      break;
    }
    default: {
      fs.stat(camino, error => {
        if (!error) {
          fs.readFile(camino, (error, contenido) => {
            if (error) {
              respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
              respuesta.write('Error interno');
              respuesta.end();
            } else {
              const vec = camino.split('.');
              const extension = vec[vec.length - 1];
              const mimearchivo = mime[extension];
              respuesta.writeHead(200, { 'Content-Type': mimearchivo });
              respuesta.write(contenido);
              respuesta.end();
            }
          });
        } else {
          respuesta.writeHead(404, { 'Content-Type': 'text/html' });
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
          respuesta.end();
        }
      });
    }
  }
}

function grabarComentarios(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', function () {
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, { 'Content-Type': 'text/html' });
    const pagina = `<!doctype html>
    <html>
     <head>    
       <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
       <link rel="stylesheet" href="css/style.css">
       <title>Smart Bytes</title>
      </head>
        <body>
        <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="marcas.html">Marcas</a></li>
        <li><a href="importancia_hardware.html">Importancia</a></li>
        <li><a href="imagenes.html">Imagenes</a></li>
        <li><a href="comentario.html">Comentario</a></li>
        <li><a href="rrss.html">Redes Sociales</a></li>
        <li><a href="sesion.html">Inicio Sesion</a></li>
        </ul><br>
        <h1>Verificacion de datos enviados</h1>
         --------------Datos--------------<br>               
                <h4>Nombre: ${formulario['nombre']}</h4><br>
                <h4>Apellido: ${formulario['apellido']}</h4><br>
                <h4>Rut: ${formulario['rut']}</h4><br>
                <h4>Mensaje: ${formulario['mensaje']}</h4><br>
                
        </body>
</html>`;
    console.log(formulario['estado']);
    respuesta.end(pagina);
    grabarEnArchivo(formulario);
  });
}

function grabarEnArchivo(formulario) {
  const datos = `nombre:${formulario['nombre']}<br>
               apellido:${formulario['apellido']}<br>
               rut:${formulario['rut']}<br>
               Mensaje:${formulario['mensaje']}<br><hr align="left" style="width:40%;">`;
  fs.appendFile('web/registro.txt', datos, error => {
    if (error)
      console.log(error);
  });
}

function leerComentarios(respuesta) {
  fs.readFile('web/registro.txt', (error, datos) => {
    respuesta.writeHead(200, { 'Content-Type': 'text/html' });
    respuesta.write('<!doctype html><html><head><link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon"><link rel="stylesheet" href="css/style.css"><title>Smart Bytes</title></head><body><ul><li><a href="index.html">Home</a></li><li><a href="marcas.html">Marcas</a></li><li><a href="importancia_hardware.html">Importancia</a></li><li><a href="imagenes.html">Imagenes</a></li><li><a href="comentario.html">Comentario</a></li> <li><a href="rrss.html">Redes Sociales</a></li></ul><h1>Datos Guardados</h1><br>');
    respuesta.write(datos);
    respuesta.write('</body></html>');
    respuesta.end();
  });
}


function validar(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });

  pedido.on('end', function () {
    const formulario = querystring.parse(info);
    if (formulario['txtuser'] == 'admin@gmail.com' && formulario['txtpass'] == '123') {
      respuesta.writeHead(302, {
        'Location': 'leercomentarios'
      });
    } else {
      respuesta.writeHead(302, {
        'Location': 'sesion.html'
      });
    }
    respuesta.end();
  });
}

console.log('Servidor web iniciado');