const moongose = require('mongoose');
const Schema = moongose.Schema;

const LocationSchema = new Schema({
    nome: { type: String },
    descricao: { type: String },
    denominacao: { type: String },
    loc: {
        type: { type: String },
        coordinates: []
    }
});

LocationSchema.index({ loc: '2dsphere' });

const LocationModel = moongose.model('Location', LocationSchema);
module.exports = LocationModel;