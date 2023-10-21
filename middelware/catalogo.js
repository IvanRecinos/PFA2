const express = require('express');
const router = express.Router();
const connectDB = require('./db');

router.use(connectDB);

router.get('/catalogo', async function(req, res) {
    const db = req.db;
    
    try {
        db.connect(function(err){
            const query_catalogo = `SELECT * from pasteles`;
            
            db.query(query_catalogo, (error, resultado_pasteles) => {
                if (error) {
                    console.error('Error al buscar la lista de producto', error);
                    return res.status(500).send('Error al buscar el producto.');
                } else {
                    res.render('pages/catalogo', {resultados_pasteles: resultado_pasteles});
                }    
            });
        })
        db.release();
    } catch (error) {
        console.error('Error al buscar la lista de producto', error);
        return res.status(500).send('Error al buscar el producto.');
    }
});

module.exports = router