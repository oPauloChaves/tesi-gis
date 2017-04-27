var showFilter = false;

function toggleFilter() {
    showFilter = !showFilter;
    var filter = document.getElementById('filter');
    filter.style.display = showFilter ? 'flex' : 'none';
}