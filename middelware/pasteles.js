const express = require('express');
const router = express.Router();
const connectDB = require('./db');

const pastel = require('./././pasteles.js');

router.use(connectDB);

router.get('/pasteles', function(req, res) {
    const db = req.db;
    const query_busqueda_categoria = `SELECT * FROM categoria`;

    db.query(query_busqueda_categoria, function(error, filas, campos) {
        if (error) {
            console.error('Error al realizar la consulta en la base de datos:', error);
            return res.status(500).send('Error al obtener datos de la base de datos.');
        }
        db.release();
        res.render('pages/pasteles', { resultados: filas });
    });
});

router.post('/guardar_pastel', function(req, res){
    const { nombre, edad } = req.body;
    const nuevaPersona = new Persona(nombre, edad);
    nuevaPersona.guardarEnBaseDeDatos();
    res.send('Datos guardados en la base de datos.');
})
 
module.exports = router