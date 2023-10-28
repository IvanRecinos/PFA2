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

router.get('/clientes', function(req, res) {
    let id = req.params.id;
    
    connection.connect(function(err){
        const query_clientes = `SELECT * FROM clientes`;
        connection.query(query_clientes, (error, clientes) => {
            if (error) {
                console.error('Error al buscar la lista de clientes', error);
                return res.status(500).send('Error al buscar los clientes.');
            } else {    
                res.render('pages/clientes', {clientes: clientes});
            }    
        });
    })
    connection.close;
});

module.exports = router