const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

let connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'pasteles_pfa2'
});

router.get('/datos_clientes/:id', function(req, res) {
    let id = req.params.id;
    
    connection.connect(function(err){
        const query_catalogo = `SELECT * FROM pasteles WHERE id_pastel = ?`;
        connection.query(query_catalogo, [id], (error, resultado_pasteles) => {
            if (error) {
                console.error('Error al buscar la lista de producto', error);
                return res.status(500).send('Error al buscar el producto.');
            } else {    
                res.render('pages/datos_clientes', {
                    resultados_pasteles: resultado_pasteles[0]
                });
            }    
        });
    })
    connection.close;
});

router.post('/clientes', (req, res) => {        
    const id_pastel = req.body.id_pastel;
    const tipo = req.body.tipo;

    // Creando el nuevo objeto cliente
    const cliente = {
        uuid: uuidv4(),
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        correo: req.body.mail,
        telefono: req.body.telefono
    }

    // Crear un objeto tarjeta si el tipo es "2"
    const tarjeta = {
        no1: req.body.no1,
        no2: req.body.no2,
        no3: req.body.no3,
        no4: req.body.no4,
        fecha: req.body.fecha,
        codigo: req.body.codigo
    }

    connection.connect(function(err) {
        const query_cliente = `INSERT INTO clientes (UUID, NOMBRE, APELLIDO, DIRECCION, TELEFONO, CORREO)
          VALUES (?, ?, ?, ?, ?, ?)`;
    
        const values = [
            cliente.uuid,
            cliente.nombre,
            cliente.apellido,
            cliente.direccion,
            cliente.telefono,
            cliente.correo
        ];

        connection.query(query_cliente, values, function(error, filas, campos) {
            if (error) {
                console.error('Error al insertar cliente en la base de datos:', error);
                return res.status(500).send('Error al guardar el cliente.');
            } else {
                const query_venta = `INSERT INTO venta (id_cliente, id_producto, total)
                VALUES (?, ?, ?)`;

                const values2 = [
                    cliente.uuid,
                    id_pastel,
                    req.body.total
                ]; 
                
                connection.query(query_venta, values2, function(error, filas, campos) {
                    if (error) {
                        console.error('Error al insertar venta en la base de datos:', error);
                        return res.status(500).send('Error al guardar la venta.');
                    } else {
                        

                        // Generar el PDF
                        const pdfDoc = new PDFDocument();
                        
                        const buffers = [];
                        pdfDoc.on('data', buffer => buffers.push(buffer));
                        pdfDoc.on('end', () => {
                            const pdfBuffer = Buffer.concat(buffers);
    
                            // Configurar las cabeceras de respuesta para el PDF
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
                            res.send(pdfBuffer);
                        });
    
                        if (tipo === "1") {
                            pdfDoc.text(`PAGO DE CONTADO`);
                        } else if (tipo === "2") {
                            pdfDoc.text(`NOTA DE CRÉDITO`);
                            pdfDoc.text(`Tarjeta: ${tarjeta.no1} - ${tarjeta.no2} - ${tarjeta.no3} - ${tarjeta.no4}`);
                            pdfDoc.text(`Fecha: ${tarjeta.fecha}`);
                        }
    
                        // Añadir contenido común al PDF
                        pdfDoc.text(`Nombre: ${cliente.nombre}`);
                        pdfDoc.text(`Apellido: ${cliente.apellido}`);
                        pdfDoc.text(`Dirección: ${cliente.direccion}`);
                        pdfDoc.text(`Correo: ${cliente.correo}`);
                        pdfDoc.text(`Teléfono: ${cliente.telefono}`);
    
                        // Finalizar el documento PDF
                        pdfDoc.end();

                        // Redirigir al usuario a /catalogo
                        
                    }    
                })   
            }    
        });
    })
    connection.close;
});


module.exports = router