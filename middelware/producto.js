const express = require('express');
const router = express.Router();
const mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'pasteles_pfa2'
});

router.get('/producto/:id', function(req, res) {
    let id = req.params.id;
    
    connection.connect(function(err){
        const query_catalogo = `SELECT * FROM pasteles WHERE id_pastel = ?`;
        connection.query(query_catalogo, [id], (error, resultado_pasteles) => {
            if (error) {
                console.error('Error al buscar la lista de producto', error);
                return res.status(500).send('Error al buscar el producto.');
            } else {    
                res.render('pages/vista_producto', {resultados_pasteles: resultado_pasteles[0]});
            }    
        });
    })
    connection.close;
});

module.exports = router