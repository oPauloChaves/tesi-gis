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

/** Denomination var from the tooltip of the button */
var denomination;

/** Method to insert a new object into map */
function insertObject(type, element) {
  denomination = element.dataset.tooltip;
  draw = new ol.interaction.Draw({
    source: source,
    type: type
  });
  draw.on('drawend', finishObject);
  map.addInteraction(draw);
}

/** Callback dispatched when geoObject is drawed */
function finishObject(event) {
  var obj = event.feature.getGeometry();
  console.log('TYPE', obj.getType());
  console.log('COORDINATES', obj.getCoordinates());
  featureToLocation(event.feature, (err, location) => {
    //storeLocation(location);
  })
  draw = null;
}

/** Method to convert feature to Location object */
function featureToLocation(feature, callback) {
  var geojsonFormat = new ol.format.GeoJSON();
  var geojsonGeometry = geojsonFormat.writeGeometryObject(feature.getGeometry());
  var location = {};
  location.denominacao = denomination;
  location.loc = geojsonGeometry;

  callback(null, location);
}


/** Method to POST the Location in the database */
function storeLocation(location) {
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/locations",
    data: JSON.stringify(location),
    contentType: "application/json",
    dataType: "json",
    success: function (data, status, jqXHR) {
      console.log("success");
    },

    error: function (jqXHR, status) {
      // error handler
      console.log(jqXHR);
      console.log('fail' + status.code);
    }
  });
}

function fetchLocations(callback) {
    $.getJSON('http://localhost:3000/locations', (data) => callback(null, data))
}
