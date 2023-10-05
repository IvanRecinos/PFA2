import { Router } from 'express';
const router = Router()

router.get('/', function(req, res){
    res.send("Hola mundo")
});



export default router