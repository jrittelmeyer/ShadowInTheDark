ig.module('game.entities.player').requires(
	'impact.entity',
	'game.entities.meleeSlash'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		//Superficial values
		hurtSound: new ig.Sound('media/sounds/warriorHurt1.*'),
		deathSound: new ig.Sound('media/sounds/warriorDeath1.*'),
		animSheet: new ig.AnimationSheet('media/shadow.gif', 16, 24),
		flip: false,
		
		//Collision values
		size: {x: 14, y: 22},
		offset: {x: 1, y: 1},
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.B,
		
		//Initial values
		score: 0,
		faceDir: 'down',
		
		//Stat values
		health: 50,
		maxHealth: 50,
		walkSpeed: 60,
		runSpeed: 120,
		maxVel: {x: 150, y: 150},
		attackCooldown: .5,
		
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			//Set initial values
			this.hitCooldown = new ig.Timer();
			this.attackTimer = new ig.Timer(this.attackCooldown);
			// Add animations for character
			this.addAnim('idle-up', 1, [1]);
			this.addAnim('idle-side', 1, [4]);
			this.addAnim('idle-down', 1, [7]);
			this.addAnim('walk-up', 0.18, [0,1,2,1]);
			this.addAnim('walk-side', 0.18, [3,4,5,4]);
			this.addAnim('walk-down', 0.18, [6,7,8,7]);
			this.addAnim('run-up', 0.10, [0,1,2]);
			this.addAnim('run-side', 0.15, [9,10,11,10,9,12]);
			this.addAnim('run-down', 0.10, [6,7,8]);
			this.addAnim('action-up', .3, [2], true);
			this.addAnim('action-side', .3, [5], true);
			this.addAnim('action-down', .3, [8], true);
			this.addAnim('hit', .05, [13, 37, 13, 37, 13, 37, 13, 37, 13], true);
			this.addAnim('die', 1, [13, 14], true);
		},
		
		update: function() {
			//Dying
			if (this.currentAnim == this.anims.die) {
				if (this.currentAnim.loopCount) if (confirm('You have died! Do you want to restart?')) ig.system.setGame(ig.ShadowInARoom); else this.kill();
			//Just hit
			} else if (this.hitCooldown.delta() < -.5) {
				this.currentAnim = this.anims.hit;
			} else {
				//Set face direction
				if (ig.input.state('face-up')) {
					this.faceDir = 'up';
					this.flip = false;
				}
				if (ig.input.state('face-right')) {
					this.faceDir = 'side';
					this.flip = false;
				} 
				if (ig.input.state('face-down')) {
					this.faceDir = 'down';
					this.flip = false;
				}
				if (ig.input.state('face-left')) {
					this.faceDir = 'side';
					this.flip = true;
				}
				//Set action
				this.action = (!ig.input.state('move-up') && !ig.input.state('move-right') && !ig.input.state('move-down') && !ig.input.state('move-left')) ? 'idle' : ig.input.state('run') ? 'run' : 'walk';
				
				//Pick animation based on moving/not and direction facing
				if ((this.currentAnim != this.anims['action-up'] && this.currentAnim != this.anims['action-side'] && this.currentAnim != this.anims['action-down']) || ((this.currentAnim == this.anims['action-up'] || this.currentAnim == this.anims['action-side'] || this.currentAnim == this.anims['action-down']) && this.currentAnim.loopCount)) {
					this.currentAnim = this.anims[this.action + '-' + this.faceDir];
				}
				//Move character
				if (ig.input.state('move-up') && !ig.input.state('move-down')) this.vel.y = -(ig.input.state('run') ? this.runSpeed : this.walkSpeed); else if (ig.input.state('move-down') && !ig.input.state('move-up')) this.vel.y = (ig.input.state('run') ? this.runSpeed : this.walkSpeed); else this.vel.y = 0;
				if (ig.input.state('move-right') && !ig.input.state('move-left')) this.vel.x = (ig.input.state('run') ? this.runSpeed : this.walkSpeed); else if (ig.input.state('move-left') && !ig.input.state('move-right')) this.vel.x = -(ig.input.state('run') ? this.runSpeed : this.walkSpeed); else this.vel.x = 0;
				
				//Attacks
				if (ig.input.state('offensive') && this.attackTimer.delta() > 0) this.dirAction('offensive');
				if (ig.input.pressed('defensive')) this.dirAction('defensive');
				
				this.currentAnim.flip.x = this.flip;
			}
			
			//Move!
			this.parent();
		},
		
		receiveDamage: function(dmg, other) {
			this.health -= dmg;
			this.sct('life', -dmg);
			this.setHealthBar();
			if (this.health > 0) {
				this.currentAnim = this.anims.hit.rewind();
				this.hurtSound.play();
			} else {
				this.currentAnim = this.anims.die.rewind();
				this.deathSound.play();
			}
		},
		
		setHealthBar: function() {
			$('#spnHealth').html(this.health);
			$('#spnMaxHealth').html(this.maxHealth);
			$('#divHealthBar').css('width', (this.health/this.maxHealth*100).toString() + '%');
			if (this.health <= 0) $('#divHealthBar').hide();
		},
		
		incrementScore: function(pts) {
			this.score += pts;
			$('#spnScore').html(this.score).animate({'color': '#6a0003'}, 1000, function() {$('#spnScore').animate({'color': '#000'}, 1000)});
			this.sct('score', pts);
		},
		
		sct: function(type, amount) {
			var color = '';
			if (type == 'score')
				color = '#82ffff';
			else if (type == 'life')
				color = amount < 0 ? '#6a0003' : '#125900';
			var elSCT = $('<div>').css('position', 'absolute').css('color', color).css('top', (ig.system.canvas.height/2) + 'px').css('left', (ig.system.canvas.width/2 + $('#divPlayerPanel').width() + this.size.x*2) + 'px').css('font-size', '0px').css('font-weight', 'bold').html(((type == 'life' && amount > 0) ? '+' : '') + amount);
			$('#body').append(elSCT);
			elSCT.animate({'font-size': 30, 'opacity': .5, 'top': (ig.system.canvas.height/2) - 100, 'left': (ig.system.canvas.width/2 + $('#divPlayerPanel').width() + this.size.x*2) + ([1,-1].random() * [0,10,20,30,40,50].random())}, 1000, function(){elSCT.remove();});
		},
		
		dirAction: function(strType) {
			this.currentAnim = this.anims['action-' + this.faceDir].rewind();
			//TODO: Move these values to the Player's "equipped weapon" property?
			var swordX = this.faceDir == 'side' ? 19 : 24, swordY = this.faceDir == 'side' ? 24 : 19, weaponURL = 'media/sword-' + (this.faceDir == 'side' ? 'side' : 'up') + '.gif';
			var xOffset = this.animSheet.width/2 + (((this.faceDir == 'up' || (this.faceDir == 'side' && this.flip)) ? -1 : 0) * swordX),
				yOffset = this.animSheet.height/2 + (((this.faceDir == 'up' || this.faceDir == 'side') ? -1 : 0) * swordY);
			if (this.faceDir == 'side' && this.flip) {
				xOffset -= 2;
				yOffset += 12;
			} else if (this.faceDir == 'side') {
				xOffset += 2;
				yOffset += 12;
			} else if (this.faceDir == 'up') { 
				xOffset += 12;
				yOffset -= 4;
			} else {
				xOffset -= 12;
				yOffset += 4;
			}
			var x = this.pos.x + xOffset,
				y = this.pos.y + yOffset,
				z = this.zIndex + (this.faceDir == 'up' ? -1 : 1);
			if (strType == 'offensive') {
				ig.game.spawnEntity(EntityMeleeSlash, x, y, {swingDir: this.faceDir, flip: this.flip, weapon: {url: weaponURL, x: swordX, y: swordY}, zIndex: z, owner: this, cooldown: this.attackTimer});
			} else if (strType == 'defensive') {
			
			}
		}
	});
});