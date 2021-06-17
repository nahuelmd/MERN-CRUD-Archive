//aca va el modelado de los datos en la base de datos
const mongoose = require('mongoose');

//aca defino el schema de los datos
const {Schema} = mongoose;

const NewsSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true },
    author: {type: String, required: true},
    archiveDate: {type: Date},
    status: {type: String}
})

module.exports = mongoose.model('News', NewsSchema);