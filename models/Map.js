const moongose = require('mongoose');
const Schema = moongose.Schema;

const mapSchema = new Schema({
    nome: { type: String, required: true, unique: true },
    center: { type: [Number] },
    zoom: { type: Number },
    locations: [{ type: Schema.Types.ObjectId, refer: 'Location' }]
});

const mapModel = moongose.model('Map', mapSchema);
module.exports = mapModel;