module.exports = (app) => {
    const Map = require('../models/Map')
    /** 
     * GET maps listing.
     * nome filter (ex.: ?nome=Teresina)
     */
    app.get('/maps', (req, res, next) => {
        console.log(JSON.stringify(req.query));
        let query = {}
        if (req.query.nome)
            query = { nome: { $regex: req.query.nome, $options: 'i' } }
        Map.find(query, (err, maps) => err ? res.status(500).send(err) : maps ? res.status(200).send(maps) : res.sendStatus(404))
    });

    /**
     * GET locaton by id
     */
    app.get('/maps/:id', (req, res, next) => Map.findOne({ _id: req.params.id }, (err, map) => err ? res.status(500).send(err) : map ? res.status(200).send(map) : res.sendStatus(404)));

    /** 
     * POST create new maps
     */
    app.post('/maps', (req, res, next) => {
        if (req.body.center) {
            const newMap = new Map(req.body);
            newMap.save((err, map) => err ? res.status(500).send(err) : map ? res.status(200).send(map) : res.sendStatus(500));
        } else {
            res.status(400).send({ message: 'nenhuma localização enviada' });
        }
    })
}