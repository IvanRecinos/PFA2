const express = require('express');
const aplicacion = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const crypto = require('crypto');

aplicacion.set('view engine', 'ejs');
aplicacion.use('/static', express.static('assets'));
aplicacion.use(bodyParser.json());
aplicacion.use(bodyParser.urlencoded({ extended: true }));
/*
aplicacion.use(session({
    secret: crypto.randomBytes(20).toString('hex'), 
    resave: false, 
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    cookie: { maxAge: (86400000) }
}));
*/

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


aplicacion.listen(8888, () => {console.log("Servidor iniciado en el puerto 8888")});