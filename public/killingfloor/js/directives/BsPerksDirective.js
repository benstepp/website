(function() {
	angular
		.module('bsPerks', [])
		.directive('bsPerks', bsPerks);

	function bsPerks() {
		return {
			restrict: 'A',
			replace:true,

			scope: {
				perks:"=bsPerks"
			},

			template: ['<div>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.fieldmedic}}</span>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.support}}</span>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.sharpshooter}}</span>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.commando}}</span>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.berserker}}</span>',
				'<span class="player-card-perk" data-ng-class=""></span>',
				'<span class="player-card-perk">{{perks.firebug}}</span>',
				'</div>'].join(''),

		};
	}

})();