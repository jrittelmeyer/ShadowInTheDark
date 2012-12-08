ig.module('game.entities.heart').requires(
	'game.entities.item'
)
.defines(function(){
	EntityHeart = EntityItem.extend({
		//Set superficial values
		animSheet: new ig.AnimationSheet('media/heart.gif', 8, 8),
		pickupSound: new ig.Sound('media/sounds/healthUp.*'),
		//Set collision values
		size: {x: 9, y: 9},
		offset: {x: -1, y: -1},

		//Set stats
		healAmount: 10,
		
		init: function(x, y, settings) {
			this.addAnim('idle', 1, [0]);
			this.parent(x, y, settings);
		},
		check: function(other) {
			if (other.health != other.maxHealth) {
				this.pickupSound.play();
				other.health += this.healAmount;
				other.setHealthBar();
				other.sct('life', this.healAmount);
				this.parent();
			}
		}
	});
});