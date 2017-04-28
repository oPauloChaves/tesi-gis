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

    vm.drawObject = drawObject;

    vm.editObject = editObject;
    vm.saveObject = saveObject;
    vm.removeObject = removeObject;
    vm.selectObject = selectObject;
    vm.lockObject = lockObject;
    vm.toggleLayer = toggleLayer;

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

    function removeObject() {
        tesiService.remove(vm.selectedObject)
            .then(function (res) {
                console.log('[SUCCESS] =>', res.data);
            })
            .catch(function (err) {
                console.error('[ERROR] =>', err)
            });
    }

    function editObject(obj) {
        vm.selectedObject = angular.copy(obj);
        vm.selectedObject.loc = openLayers.parseCoordinate(vm.selectedObject.loc);
        vm.selectedObject.index = vm.myObjects.indexOf(obj);
        $scope.state = STATE.DETAIL;
        getGeneralTitle()
    }

    function saveObject() {
        if (!!vm.selectedObject._id) {
            tesiService.edit(vm.selectedObject)
                .then(function (res) {
                    console.info('[SUCCESS] =>', res.data);
                    var feature = openLayers.parseFeature(res.data);
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
            case 'Ponto de ônibus':
                return 'directions_bus';
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
}
