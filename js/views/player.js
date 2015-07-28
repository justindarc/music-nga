var client = threads.client('music-service', new BroadcastChannel('music-service'));

function PlayerView() {
  this.seekBar = document.getElementById('seek-bar');
  this.controls = document.getElementById('controls');

  this.controls.addEventListener('play', () => this.play());
  this.controls.addEventListener('pause', () => this.pause());

  client.on('play', () => this.controls.paused = false);
  client.on('pause', () => this.controls.paused = true);

  client.on('durationChange', duration => this.seekBar.duration = duration);
  client.on('elapsedTimeChange', elapsedTime => this.seekBar.elapsedTime = elapsedTime);

  this.getPlaybackStatus().then((status) => {
    this.controls.paused = status.paused;
    this.seekBar.duration = status.duration;
    this.seekBar.elapsedTime = status.elapsedTime;
    this.render();
  });
}

PlayerView.prototype.play = function() {
  fetch('/api/audio/play');
};

PlayerView.prototype.pause = function() {
  fetch('/api/audio/pause');
};

PlayerView.prototype.getPlaybackStatus = function() {
  return fetch('/api/audio/status').then(response => response.json());
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
