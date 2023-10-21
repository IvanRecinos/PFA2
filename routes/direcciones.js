const express = require('express');
const router = express.Router()

router.get('/', function(req, res){
    res.render("pages/index")
});


router.get('/compra', function(req, res){
    res.render("pages/compra")
});

router.get('/admin', function(req, res){
    res.render("pages/admin")
});

    
module.exports = router