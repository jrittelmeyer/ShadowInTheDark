ig.module('game.entities.randomWanderAI').requires(
	'game.entities.enemy'
)
.defines(function(){
	EntityRandomWanderAI = EntityEnemy.extend({
		// Set all possible movespeeds in each direction
		// moveSpeed: {min: , max:, choices: []},
		// Set how often the AI CAN change direction
		// dirChange: {min: , max: , choices: []},
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.initAIChoices('moveSpeed');
			this.initAIChoices('dirChange');
			this.dirChange.timer = new ig.Timer(this.dirChange.choices.random());
			this.changeDir();
		},
		update: function() {
			if (this.dirChange.timer.delta() > 0) {
				this.changeDir();
				this.dirChange.timer.set(this.dirChange.choices.random());
			}
			this.parent();
		},
		initAIChoices: function(type) {
			for (i = this[type].min; i <= this[type].max; i += this[type].min) {
				this[type].choices.push(i);
			}
		},
		changeDir: function() {
			this.vel.y = [1, -1].random() * this.moveSpeed.choices.random();
			this.vel.x = [1, -1].random() * this.moveSpeed.choices.random();
		}
	});
});