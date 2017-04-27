module.exports = (app) => {
    const Location = require('../models/Location')
    const Map = require('../models/Map')
    /**
     * filtro por regex para todos os attr
     * filtro por denominacao
     */

    /** 
     * GET locations listing.
     * nome filter (ex.: ?nome=Bar)
     */
    app.get('/maps/:mid/locations', getMapLocations, (req, res, next) => {
        console.log(res.locals.locations)
        console.log(JSON.stringify(req.query));
        let query = {}
        if (res.locals.locations)
            query._id = { $in: res.locals.locations }
        if (req.query.nome)
            query.nome = { $regex: req.query.nome, $options: 'i' }
        Location.find(query, (err, locations) => err ? res.status(500).send(err) : locations ? res.status(200).send(locations) : res.sendStatus(404))
    });

    /**
     * GET location by id
     */
    app.get('/maps/:mid/locations/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => err ? res.status(500).send(err) : location ? res.status(200).send(location) : res.sendStatus(404)));

    /** 
     * POST create new locations
     */
    app.post('/maps/:mid/locations', getMapLocations, (req, res, next) => {
        if (req.body.loc) {
            const newLocation = new Location(req.body);
            newLocation.save((err, location) => {
                if (err) res.status(500).send(err)
                if (location) {
                    storeLocationMap(req.params.mid, location._id, (err, locationsList) => {
                        if (err) res.status(500).send(err)
                        else res.status(200).send(location)
                    })
                }
            });
        } else {
            res.status(400).send({ message: 'nenhuma localização enviada' });
        }
    })

    /**
     * GET the Locations near by Location
     * filter max distance (ex.:?distance=3)
     */
    app.get('/maps/:mid/locations/near/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => {
        Location.find({ loc: { $near: location.loc, $maxDistance: req.query.distance || 1 } }, (err, nears) => err ? res.status(500).send(err) : nears ? res.status(200).send(nears) : res.sendStatus(404));
    }));

    function getMapLocations(req, res, next) {
        Map.findOne({ _id: req.params.mid }, (err, map) => {
            if (err) res.status(500).send(err)
            else {
                res.locals.locations = map.locations;
                next()
            }
        });
    }
    function storeLocationMap(mapId, locationId, callback) {
        Map.findOneAndUpdate({ _id: mapId }, { $push: { locations: locationId } }, { new: true }, (err, map) => {
            if (err) callback(err);
            else callback(null, map.locations)
        });
    }
}