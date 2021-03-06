'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(900, 480, Phaser.AUTO, 'ld33');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('fail', require('./states/fail'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};