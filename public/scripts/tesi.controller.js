angular
    .module('tesi')
    .controller('TesiController', TesiController);

TesiController.$inject = ['$scope', 'openLayers', 'STATE'];
function TesiController($scope, openLayers, STATE) {
    var vm = this;
    
    vm.myObjects;
    vm.selectedObject;
    vm.isFiltering;

    vm.drawObject = drawObject;

    vm.editObject = editObject;
    vm.removeObject = removeObject;
    vm.selectObject = selectObject;
    vm.lockObject = lockObject;
    vm.toggleLayer = toggleLayer;

    vm.getGeneralTitle = getGeneralTitle;

    active();

    //////////////////////////////////////

    function active() {
        vm.myObjects = [];
        vm.selectedObject = null;
        vm.isFiltering = false;
        $scope.state = STATE.LIST;
    }

    function selectObject() {

    }

    function removeObject() {

    }

    function editObject() {

    }

    function lockObject() {

    }

    function toggleLayer() {

    }

    function drawObject(geoType, type) {
        openLayers.draw(geoType, function (event) {
            openLayers.drawStrategy = null;
            vm.selectedObject = {};
            vm.selectedObject = event.feature.getGeometry();
            vm.selectedObject.denomination = type;
            $scope.state = STATE.DETAIL;
        });
    }

    function getGeneralTitle() {
        if(!vm.selectedObject) {
            return 'Meus Objetos';   
        } else if(!!vm.selectedObject.id && vm.selectedObject.update) {
            return 'Editar Objeto';   
        } else if(!!vm.selectedObject.id && !vm.selectedObject.update) {
            return vm.selectedObject.name;   
        }
        return 'Novo objeto'; 
    }
}