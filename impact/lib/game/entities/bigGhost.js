ig.module('game.entities.bigGhost').requires(
	'game.entities.randomWanderAI',
	'game.entities.ghost'
)
.defines(function(){
	EntityBigGhost = EntityRandomWanderAI.extend({
		//Set superficial values
		deathSound: new ig.Sound('media/sounds/gibbed1.*'),
		spawnSounds: [new ig.Sound('media/sounds/burp.*'), new ig.Sound('media/sounds/burp2.*')],
		flip: false,
		animSheet: new ig.AnimationSheet('media/bubbleBobbleGhost.gif', 24, 24),
		
		//Set collision values
		size: {x: 22, y: 22},
		offset: {x: 1, y: 1},

		//Set stats
		health: 50,
		points: 2500,
		maxVel: {x: 200, y: 200},
		collideDmg: 10,
		
		//Set AI values
		moveSpeed: {min: 25, max:35, choices: []},
		dirChange: {min: .5, max: 5, choices: []},
		
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', .5, [0,1,2,3]);
			this.addAnim('hit', .05, [4,5,4,5,4,5,4,5,4], true);
			this.addAnim('die', .05, [4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,5,4,5,4], true);

			this.spawnUnitTimer = new ig.Timer(2);
		},
		update: function() {
			if (this.spawnUnitTimer.delta() > 0) {
				if (ig.game.getEntitiesByType(EntityGhost).length < 5) {
					this.spawnUnitTimer.reset();
					this.spawnSounds.random().play();
					ig.game.spawnEntity(EntityGhost, this.pos.x, this.pos.y);
				}
			}
		
			if (this.vel.x < 0) this.currentAnim.flip.x = true; else if (this.vel.x > 0) this.currentAnim.flip.x = false;
			if (this.currentAnim.loopCount) {
				if (this.health > 0) this.currentAnim = this.anims.idle;
				else {
					if (Math.random() < 1) ig.game.spawnEntity(EntityHeart, this.pos.x, this.pos.y);
					this.kill();
				}
			}
			this.parent();
		},
		charge: function() {
		}
	});
});