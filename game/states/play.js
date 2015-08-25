
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      
      this.music = this.game.add.audio('theme');
      this.music.play();
      this.endgame_counter = 0;
      // debug mode
      //this.debugger = new Phaser.Debug(this.game);
      
      // layers
      this.background = this.game.add.group();
      this.midground = this.game.add.group();
      this.walls = this.game.add.group();
      this.foreground = this.game.add.group();
      
      this.background.create(0, 0, 'background');
      this.background_count = 0;
      
      // world bounds
      this.game.world.ground = 460;
      this.game.world.bounds = new Phaser.Rectangle(0, 0, 9000, this.game.world.ground);
      
      // set the game physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 450; // 450
      
      // add player
      this.player_is_airborne = false;
      this.player_health = 1;
      this.player_health_max = 9;
      this.player_speed = 500;
      this.player_last_collision = null;
      this.player_last_collision_time = 0;
      this.player_collision_penalty_time = 66;
      this.player_start_time = 100;
      this.player_penalty_speed = 300;
      this.player_fast_speed = 600;
      this.player_start_speed = 200;
      //this.player = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'thellow');
      this.player = this.foreground.create(this.game.width / 2, this.game.height / 2, 'thellow');
      this.player.frame = 0;

      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.anchor.set(0.5, 0.5);
      
      this.player_last_jump_time = 0;
      this.player_jump_timer = 33; // a jump can only last a max of x frames
      this.player_jump_letgo = 0;
      this.player_jump_reset = 1;
      this.player_jump_velocity = -360;
      
      // make the camera follow the player
      this.game.camera.bounds = 0, 0, 900, 200;
      //console.log('derp');
      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, {x: 200, y: 0});
      //game.camera.follow(ufo, Phaser.Camera.FOLLOW_PLATFORMER);

      //
      // ADD MEATBAG
      //
      this.meatbag_backwards = 1;
      this.meatbag_speed = 400;
      this.meatbag = this.foreground.create(this.player.x + 1500, this.player.y, 'human');
      var walk = this.meatbag.animations.add('run');
      this.meatbag.animations.play('run', 20, true);
      this.meatbag.scale = new Phaser.Point(-1, 1);
      
      this.game.physics.arcade.enable(this.meatbag);
      this.meatbag.body.collideWorldBounds = true;
      this.meatbag.anchor.set(0.5, 0.5);
      
      
      this.meatbag.body.velocity.x = this.player_speed - 10;

      
      // walls
      this.wall = this.midground.create(900 * this.background_count, 400, 'cave');
      
      // score
      this.game.score = 0;
      this.game.score_multiplier = 0;
      this.score_hit = false;
      this.score_text = this.game.add.text(20, 20, "Monstrosity: 1 of 9", {
        font: "26px Arial",
        fill: "#ffaa00",
        align: "left"
      });
      this.score_text.fixedToCamera = true;
      
      // time
      this.game_time = 0;
      this.last_game_time = 0;
      this.last_anim_time = 0;
      this.game_time_text = this.game.add.text(this.game.width - 122, 20, "Score: 60", {
        font: "26px Arial",
        fill: "#ffaa00",
        align: "left"
      });
      this.game_time_text.fixedToCamera = true;

      // animation
      this.anim_step = 0;
      this.anim_rate_per_second = 8;
      this.anim_every_x_ms = 60 / this.anim_rate_per_second;

      //this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

      // camera tracking with offset
      //this.game.camera.focusOnXY(this.player.x + 200, this.player.y);

      // controls
      this.jump_button = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      
      //
      // MEATBAG TURNAROUND
      //
      
      
      //
      // PLAYER MOVEMENT SPEEDS
      //
      
      // walk if game just starting
      if (this.game_time <= this.player_start_time) {
        this.player.body.velocity.x = this.player_start_speed;
        this.meatbag.body.velocity.x = (this.player_start_speed - this.player_start_speed - this.player_start_speed);
      }
      else {
        // run since game is running
        
        // normal speed or reduced speed if recent wall collision
        if (this.game_time >= this.player_last_collision_time + this.player_collision_penalty_time) {
          //console.log('fast ' + console.log(this.player_last_collision_time + ' ' + this.player_collision_penalty_time));
          this.player.body.velocity.x = this.player_speed;
        }
        else {
          // go slow since its the start of game
          this.player.body.velocity.x = this.player_penalty_speed;
        }
        // meatbag go fast
        if (this.endgame_counter != 4) {
          this.meatbag.body.velocity.x = this.meatbag_speed;
        }
        else {
          this.meatbag.body.velocity.x = 0;
        }
        
        if (this.meatbag_backwards) {
          this.meatbag_backwards = 0;
          this.meatbag.scale = new Phaser.Point(1, 1);
        }
      }
      
      
      
      // allow another jump (reset) once spacebar is released
      // but only let it reset if player is on or near the ground
      if ((this.player.body.y > this.game.world.ground - 150) &&
          !this.jump_button.isDown)
      {
        this.player.jump_reset = 1;
      }
      
      
      // 
      // JUMP LOGIC
      //
      // continue a jump if one is already in progress // ccc
      // if (!this.player.body.onFloor())
      // {
      //   console.log('1')
      //   if (this.jump_button.isDown &&
      //       this.player_last_jump_time + this.player_jump_timer >= this.game_time &&
      //       this.player_jump_letgo == 0)
      //   {
      //     console.log('2')
      //     this.player.body.velocity.y = this.player_jump_velocity;
      //   }
      //   else {
      //     console.log('3')
      //     // airborne but not holding down button
      //     // run velocity.y = 0 one time per jump
      //     // dont allow resuming jump
      //     if (this.player_jump_letgo == 0) {
      //       console.log('4');
      //       this.player_jump_letgo = 1;
      //       this.player.body.velocity.y = 0;
      //     }
      //   }
      // }
        
        
      // else {
      //   // not airborne
      //   if (this.jump_button.isDown) {
      //     this.player_jump_letgo = 1;
      //     if (this.player_jump_reset) {
      //       // not airborne and jump reset
      //       // begin jump
      //       this.player_last_jump_time = this.game_time;
      //       this.player.body.velocity.y = this.player_jump_velocity;
      //       //console.log('2')
      //     }
      //   }
      //   else {
      //     // jump button is not down
      //     // no-op
      //   }
      // }
        
        
        
        
        
        
        
      // allow another jump (reset) once spacebar is released
      // but only let it reset if player is on or near the ground
      if ((this.player.body.y > this.game.world.ground - 150) &&
          !this.jump_button.isDown)
      {
        this.player_jump_reset = 1;
      }
      
      
      // jump
      if (this.jump_button.isDown &&
          this.player.body.onFloor() && 
          this.game_time > this.player_jump_timer &&
          this.player_jump_reset)
      {
        this.player.body.velocity.y = -360;
        this.player_jump_reset = 0;
        //this.player.jump_timer = this.game.time.now + 250;
      }
      
      
      
      //
      // BACKGROUND TILING
      //
      // if right side of background is inside camera view, create a new background
      if (this.background.children[this.background_count].x < (this.game.camera.view.x + 50)) {
        //console.log('backgrund edge is visible to camera');
        
        this.background_count ++;
        this.background.create(900 * this.background_count, 0, 'background');

        // create walls as level goes on
        if (Math.random() * (8 - 1) + 1 < 5) {
          // create a wall if backgroud number is prime
          var wall = this.walls.create(1800 * this.background_count, 400, 'cave');
          wall.frame = 1;
          wall.scale = new Phaser.Point(5, 5);
        }
          
          
        // this.enemy = [];
        // var enemy = this.enemy[i] = this.game.add.sprite(100, 400, 'creature_' + this.game.rnd.integerInRange(1, 3));
        // this.game.physics.arcade.enable(enemy);
        // enemy.jump_timer = 0;
        // enemy.jump_height = 110 + (Math.random() * 260);
        // enemy.body.collideWorldBounds = true;
        // enemy.visible = false;
        // for (var i = 0; i < 60; i++) {}

        //infinite world bounds
        this.game.world.setBounds(
          (900), 0,
          ((900 * 2) * this.background_count), 0);
      }
      
      

      // 
      // wall collisions
      //
      var count = this.walls.children.length;
      for(var i = 0; i < count; i++) {
        var boundsA = this.walls.children[i].getBounds();
        var boundsB = this.player.getBounds();
        
        // avoid duplicate wall collisions
        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
          if (this.walls.children[i] != this.player_last_collision) {
            this.player_last_collision = this.walls.children[i];
            this.onCollide('wall');
          }
        }
      }
      
      
      //
      // meatbag collisions
      //
      if (Phaser.Rectangle.intersects(this.meatbag.getBounds(), this.player.getBounds())) {
        //console.log('matbag adsfo colosion')
        this.onCollide('meatbag');
      }
      
      // text overlay
      this.game_time++;
      this.seconds_elapsed = parseInt(this.game_time / 60);
      // only update time if a second has elapsed
      if (this.seconds_elapsed != this.last_game_time) {
        
        // score
        this.game_time_text.setText("Time: " + parseInt(this.game_time / 60));
        this.last_game_time = this.seconds_elapsed;
      }
      
      
      
      // animation
      //console.log('game time: ' + this.game_time + ' last animt ime:  ' + this.last_anim_time + ' anim every ' + this.anim_every_x_ms + ' ' + (this.last_anim_time + this.anim_every_x_ms));
      if (this.game_time >= this.last_anim_time + this.anim_every_x_ms) {
        this.last_anim_time = this.game_time;
        
        //console.log('step th anim', this.anim_step);
        //this.game.debug.text('step animation ' + this.anim_step);
        this.anim_step ++;
        
        if (this.anim_step == 1) {
          this.player.rotation = 0.524; // Math.PI / 180 * 30, 30 degrees
        }
        else if (this.anim_step == 2) {
          this.player.rotation = Math.PI / 180 * 0;
        }
        else if (this.anim_step == 3) {
          this.player.rotation = Math.PI / 180 * -30;
        }
        else if (this.anim_step == 4) {
          this.player.rotation = Math.PI / 180 * 0;
          this.anim_step = 0;
        }
      }
    },
    
    clickListener: function() {
      this.game.state.start('gameover');
    },
    
    onCollide: function(object) {
      
      //player colliding with wall
      if (object == 'wall') {
        
        if (this.player_health >= this.player_health_max) {
          // full monstrocity. ignore walls
          
          this.foreground.create('cave')
          var explosion = this.foreground.create(this.player_last_collision.x, this.player_last_collision.y, 'cave');
          explosion.frame = 126;
          explosion.scale = new Phaser.Point(6, 6);
          // @todo sound
          //this.player_last_collision.destroy(); // <-- bugged
          
          this.endgame_counter += 1;
          
          // endgame
          if (this.endgame_counter == 4) {
            this.game.state.start('gameover');
          }
        }
        else {
          // not full monstrosity. walls hurt you.
          this.player_health -= 1;
        
          // game over if all health gone
          if (this.player_health < 1) {
            console.log('game over');
            this.game.state.start('fail');
          }
          
          // update text
          else {
            this.score_text.setText("Monstrosity: " + this.player_health + " of " + this.player_health_max);
          }
          
          // slow down player temporarily
          this.player_last_collision_time = this.game_time;
        }
      }
        
      
      // player colliding with human
      if (object == 'meatbag' || object == 'human') {
        
        
        if (this.player_health >= this.player_health_max) {
          // final monstrosity stage, invulnerable to walls
          this.player.tint = 0xff0000;
          this.meatbag.x = this.player.x - 800; // remove meatbag
          this.meatbag.destroy();
          this.score_text.setText("FULL MONSTROSITY!\nhint: monster bosses ignore scenery");
          
          
          
        }
        else {
          // monstrosity 1-8, walls hurt you
          this.player.tint = 0xffffff;
          this.meatbag.x = this.player.x + 800;
          
          this.player_health += 1;
          //this.meatbag.destroy();
          
          this.score_text.setText("Monstrosity: " + this.player_health + " of " + this.player_health_max);
          
          if (this.player_health >= 0 && this.player_health < 4) {
            this.player.frame = 0;
          }
          else if (this.player_health > 3 && this.player_health < 7) {
            this.player.frame = 2;
          }
          else if (this.player_health > 6) {
            this.player.frame = 1;
          }
        }
      }
    },
    
    render: function() {
      //this.game.debug.text('Current style: ' + style, 32, 64);
      //this.game.debug.spriteInfo(this.player, 32, 32);
    }
  };
  
  module.exports = Play;