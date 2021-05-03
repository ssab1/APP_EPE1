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
    case 'web/index': {
      index(pedido, respuesta);
      break;
    }
    case 'web/comentario': {
      comentario(pedido, respuesta);
      break;
    }

    case 'web/imagenes': {
      imagenes(pedido, respuesta);
      break;
    }
    case 'web/importancia_hardware': {
      importancia_hardware(pedido, respuesta);
      break;
    }
    case 'web/marcas': {
      marcas(pedido, respuesta);
      break;
    }
    case 'web/rrss': {
      rrss(pedido, respuesta);
      break;
    }
    case 'web/sesion': {
      sesion(pedido, respuesta);
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
        <li><a href="marcas">Marcas</a></li>
        <li><a href="importancia_hardware">Importancia</a></li>
        <li><a href="imagenes">Imagenes</a></li>
        <li><a href="comentario">Comentario</a></li>
        <li><a href="rrss">Redes Sociales</a></li>
        <li><a href="sesion">Inicio Sesion</a></li>
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
    respuesta.write('<!doctype html><html><head><link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon"><link rel="stylesheet" href="css/style.css"><title>Smart Bytes</title></head><body><ul><li><a href="index.html">Home</a></li><li><a href="marcas">Marcas</a></li><li><a href="importancia_hardware">Importancia</a></li><li><a href="imagenes">Imagenes</a></li><li><a href="comentario">Comentario</a></li><li><a href="rrss">Redes Sociales</a></li></ul><h1>Datos Guardados</h1><br>');
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

function index(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  
  <body id="cuerpo">
      <!----Menu de opciones-->
      <header>
          <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="marcas">Marcas</a></li>
              <li><a href="importancia_hardware">Importancia</a></li>
              <li><a href="imagenes">Imagenes</a></li>
              <li><a href="comentario">Comentario</a></li>
              <li><a href="rrss">Redes Sociales</a></li>
              <li><a href="sesion">Inicio Sesion</a></li>
          </ul>
      </header>
  
     
  
      <br><br><br>
      <!---titulo y parrafo-->
      <P>
      <H1 align="center">SMART BYTES</H1>
      </P>
      <br><br><br>
      <hr size="4px" color="#393e46" width="75%" />
      <br><br><br>
  
      <p align="center" whidth="70%"><i>El Hardware empresarial, como ocurre con el software e incluso los <br>
          programas de medición y analítica web, también ha evolucionado en <br>
          los últimos tiempos y es muy importante dotar una empresa de las <br>
          últimas novedades para poder producir más con menos esfuerzo y <br>
          tiempo y, por tanto, convertirse en más competitivos.</i></p>
  
  </body>
  
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
function imagenes(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  
  <body id="cuerpo2">
    <!----Menu de opciones-->
    <header>
      <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="marcas">Marcas</a></li>
      <li><a href="importancia_hardware">Importancia</a></li>
      <li><a href="imagenes">Imagenes</a></li>
      <li><a href="comentario">Comentario</a></li>
      <li><a href="rrss">Redes Sociales</a></li>
      <li><a href="sesion">Inicio Sesion</a></li>
      </ul>
  </header>
      <!---menu-->
    
      <!--- titulo  -->
      <div class="divtipag4">
          <h1 >Imagenes de Hardware</h1>
      <hr size="4px" color="#393e46" width="45%" align="right"/>
      </div>
        <!--- imagenes con parrafo efecto hover-->
  <div id="imagen" style="float:left">
      <div id="info">
        <p id="headline">Tarjeta de red</p>
        <p id="descripcion">La función básica que cumple una tarjeta de red es preparar, 
          enviar y controlar los paquetes de datos que transmite hacia otros equipos que
           se encuentren en la misma red o en redes remotas. Dichos equipos pueden ser
            prácticamente de cualquier tipo, incluidas unidades de almacenamiento externo,
             impresoras y demás.</p>
      </div>
    </div>
   <div id="imagen2" style="float:left">
     <div id="info">
        <p id="headline">PROCESADOR</p>
        <p id="descripcion">El procesador es el “cerebro” del ordenador.
           Es el componente encargado de la eje- cución de las instrucciones de los programas. 
           Todos los ordenadores tienen al menos un procesador.</p>
      </div>
    </div>
  <div id="imagen3" style="float:left">
     
      <div id="info">
        <p id="headline">RAM</p>
        <p id="descripcion">La memoria RAM sirve para mejorar la velocidad de respuesta al
           momento de utilizar algún programa en el ordenador ya que la información que 
           necesita dicho programa para hacerlo funcionar se encuentra almacenada en la
            memoria RAM, de esta manera, al ejecutar el programa se traslada al procesador 
            todas las instrucciones</p>
      </div>
    </div>
  <div id="imagen4" style="float:left">
     
      <div id="info">
        <p id="headline">SSD</p>
        <p id="descripcion">El disco SSD presenta muchas ventajas con respecto a los HDDs 
          y las principales son: Alta velocidad para leer y escribir datos. No hace ruido 
          debido a que no funciona de manera mecánica. Es muy eficiente en la gestión del
           consumo de energía eléctrica.</p>
      </div>
    </div>
  
  </body>
  
  </html>
  `;
  respuesta.write(pagina);
  respuesta.end();
}
function importancia_hardware(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  
  <body id="cuerpo2">
      <!----Menu de opciones-->
      <header>
          <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="marcas">Marcas</a></li>
          <li><a href="importancia_hardware">Importancia</a></li>
          <li><a href="imagenes">Imagenes</a></li>
          <li><a href="comentario">Comentario</a></li>
          <li><a href="rrss">Redes Sociales</a></li>
          <li><a href="sesion">Inicio Sesion</a></li>
          </ul>
      </header>
      <!---titulo y parrafo -->
      <h1 align="center"><b>¿Porque es importante el hardware?</b></h1>
      <img src="img/computer.jpg" class="imgpag3" align="right">
      <div class="contenedor3">
          
       <p >El hardware es la parte física de la informática, el material <br>
           que se emplea para que un ordenador o cualquier aparato electrónico <br>
            pueda funcionar y ejecutar las tareas para las que han sido diseñados. <br>
             Es pues el soporte vital de un ordenador. Tomando una pequeña metáfora, <br>
              sería para una máquina lo que para nosotros es nuestro cuerpo. A través <br>
               de nuestros sentidos recibimos información, que nuestro cerebro procesa, <br>
                y que finalmente traduce en órdenes a nuestros músculos, órganos… etc…</p>
      </div>
  
  </body>
  
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
function comentario(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  
  <body>
      <!----Menu de opciones-->
      <header>
          <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="marcas">Marcas</a></li>
          <li><a href="importancia_hardware">Importancia</a></li>
          <li><a href="imagenes">Imagenes</a></li>
          <li><a href="comentario">Comentario</a></li>
          <li><a href="rrss">Redes Sociales</a></li>
          <li><a href="sesion">Inicio Sesion</a></li>
          </ul>
      </header>
      <!---division comentario-->
      <div class="contenedorpag5">
          <div class="row">
              <div class="column">
                  <img src="img/telefono.png" class="imgtelepag5"> <br>
                  <p>+569 36545686</p>
                  <br><br><br>
                  <img src="img/email.png" vspace="30" class="imgtelepag5"> <br><br><br>
                  <p> BASTIAN.SANTIB.S@GMAIL.COM</p>
                  <br><br><br><br>
                  <img src="img/ubicacion.png" class="imgtelepag5"> <br><br>
                  <p>Republica 285, Santiago de Chile</p>
              </div>
              <div class="column">
                  <form action="cargar" method="post" align="center">
                      Nombre:
                      <br>
                      <input type="text" name="nombre" size="30"><br><br>
  
                      <form action="cargar" method="post">
                          Apellido: <br>
                          <input type="text" name="apellido" size="30"><br><br>
  
                          <form action="cargar" method="post">
                              Rut: <br>
                              <input type="text" name="rut" size="30"><br><br>
  
                              <form action="cargar" method="post">
                                  Mensaje: <br>
                          <input type="text" name="mensaje" size="30"><br><br>
  
                          <input type="submit" value="Enviar">
              </div>
  
          </div>
      </div>
  
  
  </body>
  
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
function marcas(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  
  <body id="cuerpo2">
    <!----Menu de opciones-->
    <header>
      <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="marcas">Marcas</a></li>
      <li><a href="importancia_hardware">Importancia</a></li>
      <li><a href="imagenes">Imagenes</a></li>
      <li><a href="comentario">Comentario</a></li>
      <li><a href="rrss">Redes Sociales</a></li>
      <li><a href="sesion">Inicio Sesion</a></li>
      </ul>
  </header>
      <br><br>
      <!----video y tabla-->
      <h1 align="center">Marcas de Hardware</h1>
      <div class="contenedor">
          <video src="video/video.mp4" width="560" height="315" controls class="imgpag2"></video>
          <table id="customers">
              <tr>
                <th>Marcas</th>
              </tr>
              <tr>
                <td>ASUS</td>
              </tr>
              <tr>
                <td>Corsair</td>
              </tr>
              <tr>
                <td>MSI</td>
              </tr>
              <tr>
                <td> Zotac</td>
              </tr>
              <tr>
                <td>GIGABYTE</td>
              </tr>
              <tr>
                <td>HP</td>
              </tr>
              <tr>
                <td>NVIDIA</td>
              </tr>
              <tr>
                <td>AMD</td>
              </tr>
              <tr>
                <td>Hyperx</td>
              </tr>
            </table>
      </div>
  
  </body>
  
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
function rrss(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  <body>
      <!----Menu de opciones-->
      <header>
          <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="marcas">Marcas</a></li>
          <li><a href="importancia_hardware">Importancia</a></li>
          <li><a href="imagenes">Imagenes</a></li>
          <li><a href="comentario">Comentario</a></li>
          <li><a href="rrss">Redes Sociales</a></li>
          <li><a href="sesion">Inicio Sesion</a></li>
          </ul>
      </header>
  
  <br><br><br><br><br>
  <!---division con cnnombres y rrss-->
        <div class="contenedorpag5">
          <div class="row">
              
              <div class="column">
                  <P>
                      Bastian Alonso Santibañez Sepulveda
                      <br><br><br>
                      Diego Alonso Parada Sepulveda
                      <br><br><br>
                      Bruny Alexandra Vidal Lazzaro
                  </P>
              </div>
              <div class="column">
                  <br><br>
                  <img src="img/instagram.png" class="imgtelepag5" >
                  </a><img src="img/gorjeo.png"  class="imgtelepag5" hspace="70">
                  </a><img src="img/facebook.png" class="imgtelepag5" hspace="70">
                  <br><br><br><br><br> <p>@Todos los derechos reservados</p>
              </div>
          </div>
      </div>
  
  </body>
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
function sesion(pedido, respuesta) {
  respuesta.writeHead(200, { 'Content-Type': 'text/html' });
  const pagina = `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="img/Bytes.png" type="image/x-icon">
      <link rel="stylesheet" href="css/style.css">
      <title>Smart Bytes</title>
  </head>
  <body>
      <!----Menu de opciones-->
      <header>
          <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="marcas">Marcas</a></li>
          <li><a href="importancia_hardware">Importancia</a></li>
          <li><a href="imagenes">Imagenes</a></li>
          <li><a href="comentario">Comentario</a></li>
          <li><a href="rrss">Redes Sociales</a></li>
          <li><a href="sesion">Inicio Sesion</a></li>
          </ul>
      </header>
  
      <!---division de inicio de sesion-->
        <div class="container mt-4 col-lg-4">
          <div class="card col-sm-10">
              <div class="card-body">
                  <form class="form-sign" action="validar" method="POST">
                      <div class="form-group text-center">
                          <h3>Inicio de sesion</h3>
                          <img src="img/perfil.png" alt="70" width="170"/>
                      </div>
                      <div class="form-group">
                          <label>Usuario:</label>
                          <input type="email" name="txtuser"  class="form-control" >
                      </div>
                      <div class="form-group">
                          <label>Password:</label>
                          <input type="password" name="txtpass" class="form-control" >
                      </div>
                      <input type="submit" value="Ingresar" class="btn btn-primary btn-block">
                  </form>
              </div>
          </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  </body>
  </html>`;
  respuesta.write(pagina);
  respuesta.end();
}
console.log('Servidor web iniciado');