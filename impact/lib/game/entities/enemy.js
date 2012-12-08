ig.module('game.entities.enemy').requires(
	'impact.entity'
)
.defines(function(){
	EntityEnemy = ig.Entity.extend({
	
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.hitCooldown = new ig.Timer();
		},
		update: function() {

			this.parent();
		},
		check: function(other) {
			if (other.hitCooldown.delta() > 0) {
				other.hitCooldown.set(1);
				if (other.currentAnim != other.anims.die) other.receiveDamage(this.collideDmg, this);
				if ((this.pos.y + this.size.y/2) > (other.pos.y + other.size.y/2)) {
					other.vel.y = -200;
					other.tween({vel: {y: 0}}, .5).start();
				} else if ((this.pos.y + this.size.y/2) < (other.pos.y + other.size.y/2)) {
					other.vel.y = 200;
					other.tween({vel: {y: 0}}, .5).start();
				}
				if ((this.pos.x + this.size.x/2) > (other.pos.x + other.size.x/2)) {
					other.vel.x = -200;
					other.tween({vel: {x: 0}}, .5).start();
				} else if ((this.pos.x + this.size.x/2) < (other.pos.x + other.size.x/2)) {
					other.vel.x = 200;
					other.tween({vel: {x: 0}}, .5).start();
				}
			}
		},
		receiveDamage: function(dmg, other) {
			this.health -= dmg
			if (this.health > 0) {
				this.currentAnim = this.anims.hit.rewind();
				other.hitSound.play();
			} else {
				this.deathSound.play();
				this.currentAnim = this.anims.die.rewind();
				this.checkAgainst = ig.Entity.TYPE.NONE;
				other.owner.incrementScore(this.points);
			}
		}
	});
});