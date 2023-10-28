const express = require('express');
const aplicacion = express();
const bodyParser = require('body-parser');
const session = require('express-session');

aplicacion.set('view engine', 'ejs');
aplicacion.use('/static', express.static('assets'));
aplicacion.use(bodyParser.json());
aplicacion.use(bodyParser.urlencoded({ extended: true }));

aplicacion.use(session({
  secret: 'tu_secreto', // Cambia esto por una cadena segura y única.
  resave: false,
  saveUninitialized: true,
}));


const direcciones = require('./routes/direcciones');
aplicacion.use('/', direcciones);

const index = require('./middelware/index');
aplicacion.use(index);

const pasteles = require('./middelware/pasteles');
aplicacion.use(pasteles);

const catalogo = require('./middelware/catalogo');
aplicacion.use(catalogo);

const productos = require('./middelware/producto');
aplicacion.use(productos);

const editar = require('./middelware/editar');
aplicacion.use(editar);

const inventario = require('./middelware/inventario');
aplicacion.use(inventario);

const datos_clientes = require('./middelware/datos_clientes');
aplicacion.use(datos_clientes);

const clientes = require('./middelware/clientes');
aplicacion.use(clientes);

const configuracion = require('./middelware/configuracion');
aplicacion.use(configuracion);


aplicacion.listen(8888, () => {console.log("Servidor iniciado en el puerto 8888")});