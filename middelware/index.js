const express = require('express');
const router = express.Router();
const mysql = require("mysql") ;
const readline = require('readline')

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'pasteles_pfa2'
});

router.get('/', function(req, res){
    const diasDeAntiguedad = 5;
    try {
        connection.connect(function(err) {
            // Utiliza la variable diasDeAntiguedad en la consulta SQL
            const query_catalogo = `
                SELECT *
                FROM pasteles
                WHERE fecha <= DATE_SUB(CURDATE(), INTERVAL ${diasDeAntiguedad} DAY)
                ORDER BY RAND()
                LIMIT 6;
            `;

            connection.query(query_catalogo, (error, resultado_pasteles) => {

                if (error) {
                    console.error('Error al buscar la lista de producto', error);
                    return res.status(500).send('Error al buscar el producto.');
                } else {
                    res.render("pages/index", {resultados_pasteles: resultado_pasteles});
                }
            });
        });
        connection.close;
    } catch (error) {
        console.error('Error al buscar la lista de producto', error);
        return res.status(500).send('Error al buscar el producto.');
    }
});

router.get('/busqueda_personalizada', (req, res) => {
    
    let search_query = req.query.search_query; 

    let query = `SELECT nombre_pastel FROM pasteles WHERE nombre_pastel LIKE '%${search_query}%'`
    connection.query(query, function(error, data){
        res.json(data);
        console.log(data);
    })  
    

});

module.exports = router