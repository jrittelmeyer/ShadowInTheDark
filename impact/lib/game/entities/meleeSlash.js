ig.module('game.entities.meleeSlash').requires(
	'impact.entity'
)
.defines(function(){
	EntityMeleeSlash = ig.Entity.extend({
		//Superficial values
		swingSounds: [new ig.Sound('media/sounds/slash1.*'), new ig.Sound('media/sounds/slash2.*'), new ig.Sound('media/sounds/slash3.*')],
		hitSound: new ig.Sound('media/sounds/slashHit1.*'),
		
		maxVel: {x: 150, y: 150},
		
		//Collision values
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		init: function(x, y, settings) {
			settings.cooldown.reset();
			this.swingSounds.random().play();
			this.parent(x, y, settings);
			this.animSheet = new ig.AnimationSheet(settings.weapon.url, settings.weapon.x, settings.weapon.y);
			this.size = {x: settings.weapon.x, y: settings.weapon.y};
			
			this.addAnim('idle', .06, [0, 1, 2], true);
			switch (settings.swingDir) {
				case 'up':
					ig.game.sortEntitiesDeferred();
					break;
				case 'down':
					this.currentAnim.flip.x = true;
					this.currentAnim.flip.y = true;
					break;
				case 'side':
					if (settings.flip) this.currentAnim.flip.x = true;
					break;
			}
			this.swingTime = new ig.Timer(.18);
		},
		
		update: function() {
			if (this.swingTime.delta() > 0) this.kill();
			else {
				this.vel.x = this.owner.vel.x;
				this.vel.y = this.owner.vel.y;
			}
			this.parent();
		},
		
		handleMovementTrace: function( res ) {
			this.pos.x += this.vel.x * ig.system.tick;
			this.pos.y += this.vel.y * ig.system.tick;
		},
			
		check: function( other ) {
			if (other.hitCooldown) {
				if (other.hitCooldown.delta() > 0) {
					other.hitCooldown.set(-this.swingTime.delta());
					if (other.currentAnim != other.anims.die) other.receiveDamage(10, this);
					if (this.swingDir == 'up') {
						other.vel.y = -200;
						other.tween({vel: {x: 0, y: 0}}, .5).start();
					} else if (this.swingDir == 'down') {
						other.vel.y = 200;
						other.tween({vel: {x: 0, y: 0}}, .5).start();
					} else if (this.swingDir == 'side' && this.flip) {
						other.vel.x = -200;
						other.tween({vel: {x: 0, y: 0}}, .5).start();
					} else {
						other.vel.x = 200;
						other.tween({vel: {x: 0, y: 0}}, .5).start();
					}
					setTimeout(function() {other.changeDir();}, 450);
				}
			}
		}    
	});
});