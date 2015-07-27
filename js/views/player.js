var client = threads.client('music-service', window.parent);

function PlayerView() {
  this.seekBar = document.getElementById('seek-bar');
  this.controls = document.getElementById('controls');

  this.controls.addEventListener('play', () => this.play());
  this.controls.addEventListener('pause', () => this.pause());

  client.method('getPaused').then((paused) => {
    this.controls.playing = !paused;
  });

  client.method('getDuration').then((duration) => {
    this.seekBar.duration = duration;
  });

  client.on('play', () => {
    this.controls.playing = true;
  });

  client.on('pause', () => {
    this.controls.playing = false;
  });

  client.on('durationChange', (duration) => {
    this.seekBar.duration = duration;
  });

  client.on('elapsedTimeChange', (elapsedTime) => {
    this.seekBar.elapsedTime = elapsedTime;
  });
}

PlayerView.prototype.play = function() {
  client.method('play');
};

PlayerView.prototype.pause = function() {
  client.method('pause');
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
