
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
    console.log('preloading');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
    console.log('create');
  }
};

module.exports = Boot;
