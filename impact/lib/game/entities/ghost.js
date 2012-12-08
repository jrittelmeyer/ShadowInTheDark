ig.module('game.entities.ghost').requires(
	'game.entities.randomWanderAI'
)
.defines(function(){
	EntityGhost = EntityRandomWanderAI.extend({
		//Set superficial values
		deathSound: new ig.Sound('media/sounds/gibbed1.*'),
		flip: false,
		animSheet: new ig.AnimationSheet('media/bubbleBobblePinkGhost.gif', 16, 16),
		
		//Set collision values
		size: {x: 14, y: 14},
		offset: {x: 1, y: 1},

		//Set stats
		health: 20,
		points: 50,
		maxVel: {x: 200, y: 200},
		collideDmg: 10,
		
		//Set AI values
		moveSpeed: {min: 35, max:50, choices: []},
		dirChange: {min: .5, max: 5, choices: []},
		
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', .5, [0,1]);
			this.addAnim('hit', .05, [2,3,2,3,2,3,2,3,2], true);
			this.addAnim('die', .05, [2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,3,2,3,2], true);
		},
		update: function() {
			if (this.vel.x < 0) this.currentAnim.flip.x = true; else if (this.vel.x > 0) this.currentAnim.flip.x = false;
			if (this.currentAnim.loopCount) {
				if (this.health > 0) this.currentAnim = this.anims.idle;
				else {
					if (Math.random() < .2) ig.game.spawnEntity(EntityHeart, this.pos.x, this.pos.y);
					if (Math.random() < 1) ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y);
					this.kill();
				}
			}
			this.parent();
		}
	});
});