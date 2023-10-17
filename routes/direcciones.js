const express = require('express');
const router = express.Router()

router.get('/', function(req, res){
    res.render("pages/index")
});

router.get('/producto', function(req, res){
    res.render("pages/producto")
});

router.get('/compra', function(req, res){
    res.render("pages/compra")
});

router.get('/catalogo', function(req, res){
    res.render("pages/catalogo")
});

router.get('/admin', function(req, res){
    res.render("pages/admin")
});

router.get('/pasteles', function(req, res){
    res.render("pages/pasteles")
});
    
module.exports = router