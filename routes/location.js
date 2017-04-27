module.exports = (app) => {
    const Location = require('../models/Location')
    // const Map = require('../models/Map')
    /**
     * filtro por regex para todos os attr
     * filtro por denominacao
     */

    /** 
     * GET locations listing.
     * nome filter (ex.: ?nome=Bar)
     */
    app.get('/locations', /*getMapLocations,*/(req, res, next) => {
        let query = {}
        if (req.query.nome)
            query.nome = { $regex: req.query.nome, $options: 'i' }
        Location.find(query, (err, locations) => err ? res.status(500).send(err) : locations ? res.status(200).send(locations) : res.sendStatus(404))
    });

    /**
     * GET location by id
     */
    app.get('/locations/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => err ? res.status(500).send(err) : location ? res.status(200).send(location) : res.sendStatus(404)));

    /** 
     * POST create new locations
     */
    app.post('/locations', /*getMapLocations,*/(req, res, next) => {
        if (req.body.loc) {
            const newLocation = new Location(req.body);
            newLocation.save((err, location) => {
                if (err) res.status(500).send(err)
                if (location) {
                    /*storeLocationMap(req.params.mid, location._id, (err, locationsList) => {
                        if (err) res.status(500).send(err)
                        else res.status(200).send(location)
                    })*/
                    res.status(200).send(location);
                }
            });
        } else {
            res.status(400).send({ message: 'nenhuma localização enviada' });
        }
    })

    /**
     * PUT
     */
    app.put('/locations/:id', (req, res, next) => {
        Location.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, location) => {
            if (err)
                res.status(500).send(err)
            else
                res.status(200).send(location);
        })
    })


    /**
     * DELETE
     */
    app.delete('/locations/:id', (req, res, next) => {
        Location.findOneAndRemove({ _id: req.params.id }, (err, location) => {
            if (err)
                res.status(500).send(err)
            else
                res.status(204).send({});
        })
    })


    /**
     * GET the Locations near by Location
     * filter max distance (ex.:?distance=3)
     */
    app.get('/locations/near/:id', (req, res, next) => Location.findOne({ _id: req.params.id }, (err, location) => {
        Location.find({ loc: { $near: location.loc, $maxDistance: req.query.distance || 1 } }, (err, nears) => err ? res.status(500).send(err) : nears ? res.status(200).send(nears) : res.sendStatus(404));
    }));

    /* function getMapLocations(req, res, next) {
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
     }*/
}