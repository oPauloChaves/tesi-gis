angular
    .module('tesi')
    .controller('TesiController', TesiController);

TesiController.$inject = ['$scope', 'openLayers', 'tesiService', 'STATE'];
function TesiController($scope, openLayers, tesiService, STATE) {
    var vm = this;

    vm.myObjects;
    vm.selectedObject;
    vm.isFiltering;
    vm.generalTitle;
    vm.searchInput;

    vm.drawObject = drawObject;

    vm.editObject = editObject;
    vm.saveObject = saveObject;
    vm.removeObject = removeObject;
    vm.selectObject = selectObject;
    vm.lockObject = lockObject;
    vm.toggleLayer = toggleLayer;
    vm.searchFeatures = searchFeatures;

    vm.getIcon = getIcon;
    vm.giveBack = giveBack;
    vm.getGeneralTitle = getGeneralTitle;

    active();

    //////////////////////////////////////

    function active() {
        vm.selectedObject = null;
        vm.isFiltering = false;
        $scope.state = STATE.LIST;
        getGeneralTitle();
        tesiService.list()
            .then(function (res) {
                vm.myObjects = openLayers.parseFeature(res.data);
                // make the source object accessible in list features
                vm.myObjects = vm.myObjects.map((feature, i) => {
                  delete res.data[i].loc; // remove coordinates
                  feature.tesi = res.data[i];
                  return feature;
                });
                openLayers.initializeOpenLayers(vm.myObjects);
            });
    }

    function selectObject() {

    }

    function lockObject() {

    }

    function toggleLayer() {

    }

    function removeObject(obj) {
        tesiService.remove(obj.tesi._id)
            .then(function (res) {
                console.log('[SUCCESS] =>', res.data);
                openLayers.removeFeature(obj);
            })
            .catch(function (err) {
                console.error('[ERROR] =>', err)
            });
    }

    function editObject(obj) {
        vm.selectedObject = obj.tesi;
        vm.selectedObject.index = vm.myObjects.indexOf(obj);
        $scope.state = STATE.DETAIL;
        getGeneralTitle()
    }

    function saveObject() {
      if (!!vm.selectedObject._id) {
        var coords = openLayers.parseCoordinate(vm.myObjects[vm.selectedObject.index].getGeometry());
        vm.selectedObject.loc = coords;

        tesiService.edit(vm.selectedObject)
          .then(function (res) {
            console.info('[SUCCESS] =>', res.data);
            var feature = openLayers.parseFeature(res.data);
            feature.tesi = res.data;
            delete feature.tesi.loc;
            vm.myObjects[vm.selectedObject.index] = feature;
            vm.selectedObject = null;
            $scope.state = STATE.LIST;
          })
          .catch(function (err) {
            console.error('[ERROR] =>', err)
          });
      } else {
        tesiService.save(vm.selectedObject)
          .then(function (res) {
            console.info('[SUCCESS] =>', res.data);
            var feature = openLayers.parseFeature(res.data);
            feature.tesi = res.data;
            delete feature.tesi.loc;
            vm.myObjects.push(feature);
            vm.selectedObject = null;
            $scope.state = STATE.LIST;
          })
          .catch(function (err) {
            console.error('[ERROR] =>', err)
          });
      }
    }

    function drawObject(geoType, type) {
        openLayers.draw(geoType, function (event) {
            openLayers.drawStrategy = null;
            vm.selectedObject = {};
            vm.selectedObject.denominacao = type;
            vm.selectedObject.loc = openLayers.parseCoordinate(event.feature.getGeometry());
            $scope.$apply(function () {
                $scope.state = STATE.DETAIL;
                getGeneralTitle();
            });
        });
    }

    function giveBack() {
        $scope.state = STATE.LIST;
        vm.selectedObject = null;
        getGeneralTitle();
        if (!vm.selectedObject) openLayers.removeFeature();
    }

    function getIcon(denomicacao) {
        switch (denomicacao) {
            case 'Bairro':
                return 'border_outer';
            case 'Rua':
                return 'border_inner';
            case 'Quadra':
                return 'border_all';
            case 'Edificações':
                return 'business';
            case 'Rio':
                return 'gesture';
        }
    }

    function getGeneralTitle() {
        if (!vm.selectedObject) {
            vm.generalTitle = 'Meus Objetos';
        } else if (!!vm.selectedObject.id && vm.selectedObject.update) {
            vm.generalTitle = 'Editar Objeto';
        } else if (!!vm.selectedObject.id && !vm.selectedObject.update) {
            vm.generalTitle = vm.selectedObject.name;
        } else {
            vm.generalTitle = 'Novo objeto';
        }
    }

    function searchFeatures() {
      openLayers.source.clear();

      var q = vm.searchInput.trim();

      tesiService.list(q)
        .then(function(res) {
          console.info('[FILTERED] =>', res.data);
          openLayers.parseFeature(res.data).forEach((feature, i) => {
            delete res.data[i].loc; // remove coordinates
            feature.tesi = res.data[i];
            openLayers.addFeature(feature);
          });
        });
    }
}
