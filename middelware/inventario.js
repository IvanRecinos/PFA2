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

router.get('/inventario/:id', function(req, res) {
    let id = req.params.id;
    
    connection.connect(function(err){
        const query_catalogo = `SELECT * FROM pasteles WHERE id_pastel = ?`;
        connection.query(query_catalogo, [id], (error, resultado_pasteles) => {
            if (error) {
                console.error('Error al buscar la lista de producto', error);
                return res.status(500).send('Error al buscar el producto.');
            } else {    
                res.render('pages/producto_editar', {resultados_pasteles: resultado_pasteles[0]});
            }    
        });
    })
    connection.close;
});

router.post('/modificiar_inventario',  (req, res) => {        

    let cantidad = parseFloat(req.body.cantidad);
    let nueva_cantidad = parseFloat(req.body.nueva_cantidad);

    //Creando el nuevo objeto
    const editar_pastel = {
        id_producto: req.body.id,
        categoria: req.body.categoria,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        ingredientes: req.body.ingredientes,
        cantidad: cantidad+ nueva_cantidad,
        imagen: req.body.imagen,
        fecha: req.body.fecha,
        precio: req.body.precio
    }

    connection.connect(function(err){
        const query_nuevo_pastel = `UPDATE pasteles SET
                                    id_categoria = ?,
                                    nombre_pastel = ?,
                                    descripcion = ?,
                                    ingredientes = ?,
                                    cantidad = ?,
                                    imagen = ?,
                                    fecha = ?,
                                    precio = ?
                                    WHERE id_pastel = ?`;
    
        const values = [
            editar_pastel.categoria,
            editar_pastel.nombre,
            editar_pastel.descripcion,
            editar_pastel.ingredientes,
            editar_pastel.cantidad,
            editar_pastel.imagen,
            editar_pastel.fecha,
            editar_pastel.precio,
            editar_pastel.id_producto
        ];

        connection.query(query_nuevo_pastel, values, function(error, filas, campos){
            if (error) {
                console.error('Error al insertar el producto en la base de datos:', error);
                return res.status(500).send('Error al guardar el producto.');
            } else {
                res.redirect('/pasteles');
            }    
        });
    })
    connection.close;
});


module.exports = router