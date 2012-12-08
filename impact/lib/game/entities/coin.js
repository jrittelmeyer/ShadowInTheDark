ig.module('game.entities.coin').requires(
	'game.entities.item'
)
.defines(function(){
	EntityCoin = EntityItem.extend({
		//Set superficial values
		animSheet: new ig.AnimationSheet('media/coin.gif', 8, 8),
		pickupSound: new ig.Sound('media/sounds/healthUp.*'),
		//Set collision values
		size: {x: 9, y: 9},
		offset: {x: -1, y: -1},

		//Set stats
		scoreAmount: 25,
		
		init: function(x, y, settings) {
			this.addAnim('idle', .3, [0, 1, 2, 1]);
			this.parent(x, y, settings);
		},
		check: function(other) {
			this.pickupSound.play();
			other.incrementScore(this.scoreAmount);
			this.parent();
		}
	});
});