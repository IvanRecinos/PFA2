const express = require('express');
const router = express.Router()

router.get('/', function(req, res){
    res.render("pages/index")
});

router.get('/producto', function(req, res){
    res.render("pages/producto")
});

router.get('/catalogo', function(req, res){
    res.render("pages/catalogo")
});
    
module.exports = router