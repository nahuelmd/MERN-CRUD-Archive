//Aca va Express 
const express = require('express');
const app = express();
//Aca va Morgan para ver las peticiones que vienen desde el navegador
const morgan = require('morgan');
//PATH sirve para navegar los directorios con independencia de OS aloje la aplicacion. Utiliza __dirname
const path = require('path');
//Importo MONGODB Mongoose
const {mongoose} = require('./database')

//Aca van las Settings
//Defino como puerto el standard del OS y si no existe uno tome el 8080
app.set('port', process.env.PORT || 8080);

//Aca van los Middlewares

//con Morgan veo por consola los detalles de las peticiones del navegador y la respuesta dada por el server
app.use(morgan('dev'));

//con esta funcion compruebo que todo dato que venga al servidor se comprueba si el dato es un formato JSON
//Si lo es podre acceder a los datos, tambien sirve para enviar los datos en formato JSON
app.use(express.json());



//Aca van las rutas. Antes del require defino el prefijo de las rutas
app.use('/api/news' ,require('./routes/news.routes'));


//Aca van los archivos Statics files

// console.log(__dirname + '/public');
console.log(path.join(__dirname, 'public'));
//Utilizando PATH hago que encuentre la carpeta public independientemente del OS
app.use(express.static(path.join(__dirname, 'public')))


//Aca inicia el server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});