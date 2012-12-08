ig.module('game.entities.item').requires(
	'impact.entity'
)
.defines(function(){
	EntityItem = ig.Entity.extend({
		//Set collision values
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		
		init: function(x, y, settings) {
			this.parent(x, y, settings);
		},
		check: function(other) {
			this.kill();
		}
	});
});