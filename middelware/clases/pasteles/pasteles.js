const mysql = require('mysql');

class Pastel {
  constructor(categoria, nombre, descripcion, ingredientes, cantidad, imagen) {
    this.categoria = categoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.ingredientes = ingredientes;
    this.cantidad = cantidad;
    this.imagen = imagen
  }

  guardarEnBaseDeDatos() {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pasteles_pfa2',
    });

    connection.connect();

    const query = 'INSERT INTO pasteles (id_categoria, nombre_pastel, descripcion, ingredientes, cantidad, imagen) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
        this.categoria = categoria,
        this.nombre = nombre,
        this.descripcion = descripcion,
        this.ingredientes = ingredientes,
        this.cantidad = cantidad,
        this.imagen = imagen
    ];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al guardar en la base de datos:', error);
      } else {
        console.log('Datos guardados en la base de datos');
      }
      connection.end();
    });
  }
}

module.exports = Pastel;
