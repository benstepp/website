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

    		template: ['<div class="player-card">',
    			'<img data-ng-src="{{player.data.summary.avatar}}" class="player-avatar" />',
    			'<span class="player-card-name">{{player.data.summary.personaName}}</span>',
                '<span ng-transclude></span>',
    			'</div>'].join(''),

    		link: function(scope, elem, attrs) {

    		}

    	};
    }
})();