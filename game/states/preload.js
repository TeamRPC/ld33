
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('menu', 'assets/menu.jpg');
    this.load.image('win', 'assets/win2.jpg');
    this.load.image('lose', 'assets/fail.jpg');
    this.load.image('background', 'assets/background.jpg');
    this.load.spritesheet('thellow', 'assets/thellows.png', 76, 84, 3);
    this.load.image('gameover', 'assets/gameover.jpg');
    this.load.spritesheet('cave', 'assets/cave_6.png', 16, 16, 209);
    this.load.spritesheet('human', 'assets/theHuman.png', 30, 30, 8);
    //this.load.audio('theme', ['assets/song-wdrums.mp3']);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
