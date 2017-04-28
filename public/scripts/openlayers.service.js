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

        var features = new ol.Collection(listFeatures);
        /** GeoObjects over map layer */
        vm.source = new ol.source.Vector({ features: features });

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
                projection: 'EPSG:4326',
                center: [-42.811191, -5.090376],
                zoom: 15
            })
        });

        highlightFeature();
        selectFeature();
        modifyFeature(features);
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

    /* Highlight feature under the cursor */
    function highlightFeature() {
      var highlightStyleCache = {};

      var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: vm.map,
        style: function (feature, resolution) {
          var text = resolution < 5000 ? feature.get('name') : '';
          if (!highlightStyleCache[text]) {
            highlightStyleCache[text] = new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: '#f00',
                width: 2
              }),
              fill: new ol.style.Fill({
                color: 'rgba(240,215,215,0.1)'
              })
            });
          }
          return highlightStyleCache[text];
        }
      });

      var highlight;
      var displayFeatureInfo = function (pixel) {

        var feature = vm.map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });

        /*var info = document.getElementById('info');
        if (feature) {
          info.innerHTML = feature.getId() + ': ' + feature.get('name');
        } else {
          info.innerHTML = '&nbsp;';
        }*/

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature);
          }
          highlight = feature;
        }

      };

      vm.map.on('pointermove', function (evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = vm.map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
      });

      vm.map.on('click', function (evt) {
        displayFeatureInfo(evt.pixel);
      });
    }

    /* Select an object when clicking on it */
    function selectFeature() {
      // a normal select interaction to handle click
      var select = new ol.interaction.Select({
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: 'rgba(240,215,215,0.1)'
          })
        })
      });
      vm.map.addInteraction(select);
    }

    /**
     * Modify existing features.
     * You may add new vertices or delete them.
     * To delete a vertice, hold SHIFT and click on a vertice
     *
     * @param {any} features
     */
    function modifyFeature(features) {
      var modify = new ol.interaction.Modify({
        features: features,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function (event) {
          return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
        }
      });
      vm.map.addInteraction(modify);
    }
}
