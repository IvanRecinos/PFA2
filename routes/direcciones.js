const express = require('express');
const router = express.Router()

router.get('/', function(req, res){
    res.send("Hola mundo")
});



module.exports = router