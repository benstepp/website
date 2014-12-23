(function() {
	angular
		.module('getOrder', [])
		.filter('getOrder', [getOrder]);

	function getOrder() {
		return function(items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function(item,key) {
				item.name = key;
				filtered.push(item);
			});
			filtered.sort(function (a, b) {
				return (a[field] > b[field] ? 1 : -1);
			});
		  	if(reverse) filtered.reverse();
		  	return filtered;
		};
	}
})();