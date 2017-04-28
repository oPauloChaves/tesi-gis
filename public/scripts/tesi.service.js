angular
    .module('tesi')
    .service('tesiService', tesiService);

tesiService.$injector = ['$http'];
function tesiService($http) {

    var vm = this;

    vm.save = save;
    vm.load = load;
    vm.list = list;
    vm.edit = edit;
    vm.remove = remove;

    /////////////////////////////////

    function save(obj) {
        return $http.post('/locations', obj);
    }

    function load(id) {
        return $http.get('/locations/'.concat(id));
    }

    function list(q) {
        if (q) {
          return $http.get('/locations?nome='+q);
        }
        return $http.get('/locations');
    }

    function edit(obj) {
        return $http.put('/locations/'.concat(obj._id), obj);
    }

    function remove(id) {
        return $http.delete('/locations/'.concat(id));
    }
}
