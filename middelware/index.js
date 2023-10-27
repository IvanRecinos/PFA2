const express = require('express');
const { rmSync } = require('fs');
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
    const diasDeAntiguedad = 13;
    try {
        connection.connect(function(err) {
            // Utiliza la variable diasDeAntiguedad en la consulta SQL
            const query_catalogo = `
                SELECT *
                FROM pasteles
                WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL ${diasDeAntiguedad} DAY)
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
/*
router.get('/busqueda_personalizada', (req, res) => {
    
    let search_query = req.query.search_query; 

    let query = `SELECT nombre_pastel FROM pasteles WHERE nombre_pastel LIKE '%${search_query}%'`
    connection.query(query, function(error, data){
        res.json(data);
        console.log(data);
    })  
});
*/

/*
router.get('/busqueda_personalizada', async function(req, res) {
    let searchQuery = req.query.search_query;
    
    try {
        let keywords = searchQuery.split(/\s+(?:y|o)\s+/i);
        let condiciones = [];

        // Consultas base para cada columna
        const query_nombre_pastel = `nombre_pastel LIKE ?`;
        const query_descripcion = `descripcion LIKE ?`;
        const query_ingredientes = `ingredientes LIKE ?`;

        keywords.forEach(keyword => {
            // Crear condiciones SQL para cada palabra clave y para las columnas deseadas
            const condition = `(${query_nombre_pastel} OR ${query_descripcion} OR ${query_ingredientes})`;
            condiciones.push(condition);
        });

        // Construir la consulta SQL final
        const sqlQuery = `SELECT * FROM pasteles WHERE ${condiciones.join(' AND ')}`
        const sqlParams = keywords.map(keyword => `%${keyword}%`);
        
        // Ejecutar la consulta SQL y procesar los resultados
        const resultados = await queryAsync(connection, sqlQuery, sqlParams);
        console.log(resultados);
        console.log(sqlQuery);
        
        res.json(resultados);
       
    } catch (error) {
        console.error('Error al realizar las consultas en la base de datos:', error);
        return res.status(500).send('Error al obtener datos de la base de datos.');
    }
});
*/

 /*
res.render('pages/pasteles', { 
    resultados_categoria: resultado_categoria,
    resultados_pasteles: resultado_pasteles,
    mensaje: mensaje
});
*/
router.get('/busqueda_personalizada', async function(req, res) {
    let search_query = req.query.search_query; 
    let array = [];
    
    try {
        // Consulta para obtener todas las categorías
        const query_busqueda_categoria = 'SELECT categoria FROM categoria';
        const categorias = await queryAsync(connection, query_busqueda_categoria);

        const query_resultado_pasteles = `SELECT nombre_pastel FROM pasteles WHERE nombre_pastel LIKE '%${search_query}%'`;
        const resultado_pasteles = await queryAsync(connection, query_resultado_pasteles);

        // Combinar cada categoría con cada resultado de pasteles
        categorias.forEach(categoria => {
            resultado_pasteles.forEach(pastel => {
                array.push(`${categoria.categoria} ${pastel.nombre_pastel}`);
            });
        });

        console.log(array);
    } catch (error) {
        console.error('Error al realizar las consultas en la base de datos:', error);
        return res.status(500).send('Error al obtener datos de la base de datos.');
    }
});


function queryAsync(db, query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = router