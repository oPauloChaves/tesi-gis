angular
    .module('tesi')
    .service('openLayers', openLayers);

function openLayers() {

    var vm = this;

    /** Background map layer */
    vm.raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    /** GeoObjects over map layer */
    vm.source = new ol.source.Vector();

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

    vm.draw = draw;

    //////////////////////////////////////

    function draw(geoType, cb) {
        vm.drawStrategy = new ol.interaction.Draw({
            source: vm.source,
            type: geoType
        });
        vm.drawStrategy.on('drawend', cb)
        vm.map.addInteraction(vm.drawStrategy);
    }
}