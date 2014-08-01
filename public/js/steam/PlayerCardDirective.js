(function() {
    angular
        .module('bsPlayerCard', [])
        .directive('bsPlayerCard', bsPlayerCard);

    function bsPlayerCard() {
    	return {
    		restrict: 'A',
            transclude: true,
    		replace:true,

    		scope: {
    			player:"=bsPlayerCard"
    		},

    		template: ['<div>',
    			'<img data-ng-src="{{player.avatar}}" class="player-avatar" />',
    			'<span class="player-card-name">{{player.personaName}}</span>',
                '<span ng-transclude></span>',
    			'</div>'].join(''),

    		link: function(scope, elem, attrs) {

    		}

    	};
    }
})();