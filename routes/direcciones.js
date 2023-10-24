const express = require('express');
const router = express.Router()

router.get('/vista', function(req, res){
    res.render("pages/vista")
});

router.get('/admin', function(req, res){
    res.render("pages/admin")
});

    
module.exports = router