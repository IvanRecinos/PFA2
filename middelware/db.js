const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pasteles_pfa2',
};

const pool = mysql.createPool(dbConfig);

function connectDB(req, res, next) {
  pool.getConnection((error, connection) => {
    if (error) {
      return res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }

    req.db = connection;
    
    next(); 
  });
}

module.exports = connectDB;