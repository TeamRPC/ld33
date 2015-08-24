
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
    this.load.image('background', 'assets/background.jpg');
    this.load.image('thellow1', 'assets/thellow1.png');
    this.load.image('thellow2', 'assets/thellow2.png');
    this.load.image('thellow3', 'assets/thellow3.png');
    this.load.image('gameover', 'assets/gameover.jpg');
    this.load.spritesheet('cave', 'assets/cave_6.png', 16, 16, 209);

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
