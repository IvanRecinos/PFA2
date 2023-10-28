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

    //Creando el nuevo objeto
    const cliente = {
        uuid: uuidv4(),
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        correo: req.body.mail,
        telefono: req.body.telefono
    }

    connection.connect(function(err){
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

        connection.query(query_cliente, values, function(error, filas, campos){
            if (error) {
                console.error('Error al insertar aliente en la base de datos:', error);
                return res.status(500).send('Error al guardar el producto.');
            } else {
                const query_venta = `INSERT INTO ventas (ID_CLIENTE, ID_PASTEL, TOTAL)
                VALUES (?, ?, ?)`;

                const values2 = [
                    cliente.uuid,
                    id_pastel,
                    req.body.total
                ]; 
                
                connection.query(query_venta, values2, function(error, filas, campos){
                    res.render('pages/catalogo')
                })

                const tarjeta = {
                    no1: req.body.no1,
                    no2: req.body.no2,
                    no3: req.body.no2,
                    no4: req.body.no2,
                    fecha: req.body.fecha,
                    codigo: req.body.codigo
                }

                if(tipo === "1"){
                    const pdfDoc = new PDFDocument();

                    // Crear un búfer de escritura para el PDF
                    const buffers = [];
                    pdfDoc.on('data', buffer => buffers.push(buffer));
                    pdfDoc.on('end', () => {
                        const pdfBuffer = Buffer.concat(buffers);

                        // Configurar la respuesta HTTP para el PDF
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
                        res.send(pdfBuffer);
                    });

                    // Añadir contenido al PDF
                    pdfDoc.text(`PAGO DE CONTADO`);
                    pdfDoc.text(`Nombre: ${cliente.nombre}`);
                    pdfDoc.text(`Apellido: ${cliente.apellido}`);
                    pdfDoc.text(`Dirección: ${cliente.direccion}`);
                    pdfDoc.text(`Correo: ${cliente.correo}`);
                    pdfDoc.text(`Teléfono: ${cliente.telefono}`);

                    // Finalizar el documento PDF
                    pdfDoc.end();

                } else if(tipo === "2"){
                    const pdfDoc = new PDFDocument();   

                    // Crear un búfer de escritura para el PDF
                    const buffers = [];
                    pdfDoc.on('data', buffer => buffers.push(buffer));
                    pdfDoc.on('end', () => {
                        const pdfBuffer = Buffer.concat(buffers);

                        // Configurar la respuesta HTTP para el PDF
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
                        res.send(pdfBuffer);
                    });

                    // Añadir contenido al PDF
                    pdfDoc.text(`NOTA DE CRÉDITO`);
                    pdfDoc.text(`Nombre: ${cliente.nombre}`);
                    pdfDoc.text(`Apellido: ${cliente.apellido}`);
                    pdfDoc.text(`Dirección: ${cliente.direccion}`);
                    pdfDoc.text(`Correo: ${cliente.correo}`);
                    pdfDoc.text(`Teléfono: ${cliente.telefono}`);
                    pdfDoc.text(`Tarjeta: ${tarjeta.no1} - ${tarjeta.no2} - ${tarjeta.no3} - ${tarjeta.no4}`);
                    pdfDoc.text(`Fecha: ${cliente.fecha}`);

                    // Finalizar el documento PDF
                    pdfDoc.end();
                } 
            }    
        });
    })
    connection.close;
});

module.exports = router