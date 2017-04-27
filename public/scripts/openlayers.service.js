angular
    .module('tesi')
    .service('openLayers', openLayers);

function openLayers() {

    var vm = this;

    vm.initializeOpenLayers = initializeOpenLayers;

    vm.draw = draw;
    vm.parseFeature = parseFeature;
    vm.parseCoordinate = parseCoordinate;

    vm.addFeature = addFeature;
    vm.editFeature = editFeature;
    vm.removeFeature = removeFeature;

    //////////////////////////////////////

    function initializeOpenLayers(listFeatures) {
        /** Background map layer */
        vm.raster = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        /** GeoObjects over map layer */
        vm.source = new ol.source.Vector({ features: listFeatures });

        /** GeoObjects layer */
        vm.vector = new ol.layer.Vector({
            source: vm.source
        });

        vm.drawStrategy;

        /** Map setup */
        vm.map = new ol.Map({
            layers: [vm.raster, vm.vector],
            target: 'map',
            view: new ol.View({
                center: [-4765694, -567410],
                zoom: 15
            })
        });
    }

    function draw(geoType, cb) {
        vm.drawStrategy = new ol.interaction.Draw({
            source: vm.source,
            type: geoType
        });
        vm.drawStrategy.on('drawend', cb)
        vm.map.addInteraction(vm.drawStrategy);
    }

    function removeFeature(feature) {
        var feature = !feature ? vm.source.getFeatures().pop() : feature;
        vm.source.removeFeature(feature);
    }

    function addFeature(feature) {
        vm.source.addFeature(feature);
    }

    function editFeature(feature) {
        removeFeature(feature);
        addFeature(feature);
    }

    function parseCoordinate(rawCoordinates) {
        var geojsonFormat = new ol.format.GeoJSON();
        return geojsonFormat.writeGeometryObject(rawCoordinates);
    }

    function parseFeature(rawFeature) {
        try {
            if (rawFeature instanceof Array) {
                return rawFeature.map(_parseFeature);
            }
        } catch (e) {
            console.error('IGNORE', e)
        }
        return _parseFeature(rawFeature);
    }

    function _parseFeature(rawFeature) {
        var geojsonFormat = new ol.format.GeoJSON();
        return geojsonFormat.readFeature(rawFeature.loc);
    }
}