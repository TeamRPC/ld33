
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      
      
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
      this.player_health = 9;
      this.player_speed = 600;
      this.player_last_collision = null;
      this.player_last_collision_time = 0;
      this.player_collision_penalty_time = 66;
      this.player_penalty_speed = 200;
      this.player = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'thellow2');
      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.anchor.set(0.5, 0.5);
      
      this.player.jump_timer = this.game.time.now + 1050; // dont let the player jump right away
      this.player.jump_reset = 1;
      
      // make the camera follow the player
      this.game.camera.bounds = 0, 0, 900, 200;
      //console.log('derp');
      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, {x: 200, y: 0});
      //game.camera.follow(ufo, Phaser.Camera.FOLLOW_PLATFORMER);

      // add meatbag
      this.meatbag = this.foreground.create(this.player.x + 600, this.player.y, 'human');
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
      this.score_text = this.game.add.text(20, 20, "Evolution Stage: 1\nCheckpoint: 9", {
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
      
      // player running
      // normal speed or reduced speed if recent wall collision
      if (this.game_time >= this.player_last_collision_time + this.player_collision_penalty_time) {
        //console.log('fast ' + console.log(this.player_last_collision_time + ' ' + this.player_collision_penalty_time));
        this.player.body.velocity.x = this.player_speed;
      }
      else {
        //console.log('slow');
        this.player.body.velocity.x = this.player_penalty_speed;
      }
      
      
      
      
      // allow another jump (reset) once spacebar is released
      // but only let it reset if player is on or near the ground
      if ((this.player.body.y > this.game.world.ground - 150) &&
          !this.jump_button.isDown)
      {
        this.player.jump_reset = 1;
      }
      
      
      // jump
      if (this.jump_button.isDown &&
          this.player.body.onFloor() && 
          this.game.time.now > this.player.jump_timer &&
          this.player.jump_reset)
      {
        this.player.body.velocity.y = -360;
        this.player.jump_reset = 0;
        //this.player.jump_timer = this.game.time.now + 250;
      }
      
      
      // background tiling
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
      
      

      // collisions
      var count = this.walls.children.length;
      for(var i = 0; i < count; i++) {
        var boundsA = this.walls.children[i].getBounds();
        var boundsB = this.player.getBounds();
        
        // avoid duplicate collisions
        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
          if (this.walls.children[i] != this.player_last_collision) {
            this.player_last_collision = this.walls.children[i];
            this.onCollide('wall');
          }
        }
      }
      
      // text overlay
      this.game_time++;
      this.seconds_elapsed = parseInt(this.game_time / 60);
      // only update time if a second has elapsed
      if (this.seconds_elapsed != this.last_game_time) {
        
        // score
        this.game_time_text.setText("Time: " + parseInt(this.game_time / 60) +
        '\nspeed ' + this.player.body.velocity.x);
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
      
      // player colliding with wall
      if (object == 'wall') {
        this.player_health --;
        
        // game over if all health gone
        if (this.player_health < 1) {
          console.log('game over');
          this.game.state.start('gameover');
        }
        
        // update text
        else {
          this.score_text.setText("Health: " + this.player_health + "\nScore: "+ this.player_score);
        }
        
        // slow down player temporarily
        this.player_last_collision_time = this.game_time;
        
        
      }
      
      // player colliding with human
      else if (object == 'meatbag' || object == 'human') {
        this.player_score ++;
        this.meatbag.destroy();
      }
    },
    
    render: function() {
      //this.game.debug.text('Current style: ' + style, 32, 64);
      //this.game.debug.spriteInfo(this.player, 32, 32);
    }
  };
  
  module.exports = Play;