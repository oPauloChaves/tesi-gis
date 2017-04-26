const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

/* GET locations listing. */
router.get('/', (req, res, next) => {
    console.log(JSON.stringify(req.query));
    let query = {}
    if (req.query.nome)
        query = { nome: { $regex: req.query.nome, $options: 'i' } }
    Location.find(query, (err, locations) => err ? res.status(500).send(err) : locations ? res.status(200).send(locations) : res.sendStatus(404))
});

router.get('/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => err ? res.status(500).send(err) : location ? res.status(200).send(location) : res.sendStatus(404)));
/** 
 * POST create new locations
 */
router.post('/', (req, res, next) => {
    if (req.body.loc) {
        const newLocation = new Location(req.body);
        newLocation.save((err, location) => err ? res.status(500).send(err) : location ? res.status(200).send(location) : res.sendStatus(500));
    } else {
        res.status(400).send({ message: 'nenhuma localização enviada' });
    }
})

router.get('/near/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => {
    Location.find({ loc: { $near: location.loc } }, (err, nears) => err ? res.status(500).send(err) : nears ? res.status(200).send(nears) : res.sendStatus(404));
}));

module.exports = router;
