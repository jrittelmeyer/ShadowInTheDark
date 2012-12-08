ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.entities.player',
	'game.levels.test',
	'impact.debug.debug',
	'game.entities.coin',
	'game.entities.heart'
)
.defines(function(){

ig.ShadowInARoom = ig.Game.extend({
	init: function() {
		$('#divHealthBar').show();
		this.loadLevel(LevelTest);
		
		// Bind keys etc.
		ig.input.bind(ig.KEY.ESC, 'pause');
		
		ig.input.bind(ig.KEY.UP_ARROW, 'face-up');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'face-right');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'face-down');
		ig.input.bind(ig.KEY.LEFT_ARROW, 'face-left');
		
		ig.input.bind(ig.KEY.W, 'move-up');
		ig.input.bind(ig.KEY.D, 'move-right');
		ig.input.bind(ig.KEY.S, 'move-down');
		ig.input.bind(ig.KEY.A, 'move-left');
		
		ig.input.bind(ig.KEY.SHIFT, 'run');
		ig.input.bind(ig.KEY.SPACE, 'offensive');
		ig.input.bind(ig.KEY.CTRL, 'defensive');
	},
	
	update: function() {
		if (ig.input.pressed('pause')) if ($('#hdnPaused').val() == "0") {$('#hdnPaused').val("1"); $('#divPaused').removeClass('dn'); ig.system.stopRunLoop.call(ig.system);}
			
	
		// screen follows the player
		var player = this.getEntitiesByType(EntityPlayer)[0];
		if(player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		
		$('#spnScore').html(player.score);
		player.setHealthBar();
		
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});
 
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', ig.ShadowInARoom, 60, 320, 240, 1);
alert('did it');

var scale;
if (ig.ua.viewport.height < 300) scale = 1;
else if (ig.ua.viewport.height < 500) scale = 1.5;
else if (ig.ua.viewport.height < 700) scale = 2;
else if (ig.ua.viewport.height < 900) scale = 2.5;
else scale = 3;
ig.system.resize(((ig.ua.viewport.width - 2)/scale) -100,(ig.ua.viewport.height - 10)/scale, scale);

$('#divPlayerPanel').height(ig.ua.viewport.height).width(ig.ua.viewport.width - ig.system.canvas.width - 19);

});
