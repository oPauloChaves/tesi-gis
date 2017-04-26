/** Background map layer */
var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

/** GeoObjects over map layer */
var source = new ol.source.Vector();

/** GeoObjects layer */
var vector = new ol.layer.Vector({
    source: source
});

/** Map setup */
var map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
        center: [-4765694, -567410],
        zoom: 15
    })
});

/** Draw instance */
var draw;

/** Method to insert a new object into map */
function insertObject(type) {
    draw = new ol.interaction.Draw({
        source: source,
        type: type
    });
    draw.on('drawend', finishObject)
    map.addInteraction(draw);
}

/** Callback dispatched when geoObject is drawed */
function finishObject(event) {
    var obj = event.feature.getGeometry();
    console.log('TYPE', obj.getType());
    console.log('COORDINATES', obj.getCoordinates());
    draw = null;
}