(function() {
    angular
        .module('bsPlayerCard', [])
        .directive('bsPlayerCard', bsPlayerCard);

    function bsPlayerCard() {
    	return {
    		restrict: 'A',

    		replace:true,

    		scope: {
    			player:"=bsPlayerCard"
    		},

    		template: ['<div>',
    			'<img data-ng-src="//media.steampowered.com/steamcommunity/public/images/avatars/{{player.avatar}}" class="player-avatar" />',
    			'<span class="player-card-name">{{player.personaName}}</span>',
    			'</div>'].join(''),

    		link: function(scope, elem, attrs) {

    		}

    	};
    }
})();