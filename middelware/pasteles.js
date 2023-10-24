const express = require('express');
const router = express.Router();
const multer = require('multer');  
const { v4: uuidv4 } = require('uuid'); 

const mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'pasteles_pfa2'
});


// Configura el middleware Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/images/img_pasteles'); 
    },
    filename: function (req, file, cb) {
        uuid = uuidv4(); 
        extension = file.originalname.split('.').pop();
        const nombreArchivo = uuid + '.' + extension; 
        cb(null, nombreArchivo);
    },
});
const upload = multer({ storage: storage });

router.get('/pasteles', async function(req, res) {
    
    try {
        const query_busqueda_categoria = 'SELECT * FROM categoria';
        const query_resultado_pasteles = 'SELECT * FROM pasteles';

        const [resultado_categoria, resultado_pasteles] = await Promise.all([
            queryAsync(connection, query_busqueda_categoria),
            queryAsync(connection, query_resultado_pasteles)
        ]);

        const mensaje = req.query.mensaje || '';
        res.render('pages/pasteles', { 
            resultados_categoria: resultado_categoria,
            resultados_pasteles: resultado_pasteles,
            mensaje: mensaje
        });
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


router.post('/guardar_pastel', upload.single('archivo'), (req, res) => {        

    const identicador = uuid;
    const ext = extension;

    //Creando el nuevo objeto
    const nuevo_pastel = {
        categoria: req.body.categoria,
        producto: req.body.producto,
        descripcion: req.body.descripcion,
        ingredientes: req.body.ingredientes,
        cantidad: req.body.cantidad,
        imagen: identicador + '.' + ext,
        fecha: req.body.fecha
    }

    connection.connect(function(err){
        const query_nuevo_pastel = `INSERT INTO pasteles (id_categoria, nombre_pastel, descripcion, ingredientes, cantidad, imagen, fecha)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            nuevo_pastel.categoria,
            nuevo_pastel.producto,
            nuevo_pastel.descripcion,
            nuevo_pastel.ingredientes,
            nuevo_pastel.cantidad,
            nuevo_pastel.imagen,
            nuevo_pastel.fecha
        ];

        connection.query(query_nuevo_pastel, values, function(error, filas, campos){
            if (error) {
                console.error('Error al insertar el producto en la base de datos:', error);
                return res.status(500).send('Error al guardar el producto.');
            } else {
                res.redirect('/pasteles?mensaje=Registro guardado exitosamente');
            }    
        });
    })
    connection.close;
});

module.exports = router