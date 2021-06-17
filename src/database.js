//archivo para conectar a la BBDD
const mongoose = require ('mongoose');

const uri = 'mongodb+srv://TestIsobar:FSETDzhY1MY7kPKb@isobar.fcfdz.mongodb.net/dbAllfunds?retryWrites=true&w=majority';
const option = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(uri,option)
    //con then defino el evento de conexion y que hacer al suceder esto. console.log
    .then(db => console.log('La base de datos esta conectada con dbAllfunds'))
    //si hubise un error con catch lo capturo y lo imprimo con console.log
    .catch(err => console.log(err));

 module.exports = mongoose;