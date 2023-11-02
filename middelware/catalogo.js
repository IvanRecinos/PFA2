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

router.get('/catalogo', (req, res) => {

    try {
        connection.connect(function(err){
            const query_catalogo = `SELECT * from pasteles`;
            
            connection.query(query_catalogo, (error, resultado_pasteles) => {
                if (error) {
                    console.error('Error al buscar la lista de producto', error);
                    return res.status(500).send('Error al buscar el producto.');
                } else {
                    res.render('pages/catalogo', {resultados_pasteles: resultado_pasteles});
                }    
            });
        })
        connection.close;
    } catch (error) {
        console.error('Error al buscar la lista de producto', error);
        return res.status(500).send('Error al buscar el producto.');
    }
});

module.exports = router