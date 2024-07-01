import mysql from 'mysql'



const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "examen",    
    port: 3306,
});

conexion.connect( (error)=> {
    if(error){
        console.log('El error de conexión es: '+error)
        return
    }
    console.log('¡Conectado a la base de datos MySQL!')
})

export default conexion;
