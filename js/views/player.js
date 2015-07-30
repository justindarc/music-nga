function PlayerView() {
  this.artwork = document.getElementById('artwork');
  this.seekBar = document.getElementById('seek-bar');
  this.controls = document.getElementById('controls');

  this.seekBar.addEventListener('seek', evt => this.seek(evt.detail.elapsedTime));

  this.controls.addEventListener('play', () => this.play());
  this.controls.addEventListener('pause', () => this.pause());

  this.client = threads.client('music-service', window.parent);

  this.client.on('play', () => this.controls.paused = false);
  this.client.on('pause', () => this.controls.paused = true);

  this.client.on('durationChange', duration => this.seekBar.duration = duration);
  this.client.on('elapsedTimeChange', elapsedTime => this.seekBar.elapsedTime = elapsedTime);

  this.getPlaybackStatus().then((status) => {
    this.getSong(status.filePath).then((song) => {
      this.artwork.artist = song.metadata.artist;
      this.artwork.album = song.metadata.album;
    });

    this.artwork.src = '/api/songs/artwork' + status.filePath;
    this.controls.paused = status.paused;
    this.seekBar.duration = status.duration;
    this.seekBar.elapsedTime = status.elapsedTime;
    this.render();
  });

  window.addEventListener('destroy', () => this.destroy());
}

PlayerView.prototype.destroy = function() {
  this.artwork = null;
  this.seekBar = null;
  this.controls = null;

  this.client.destroy();
  this.client = null;
};

PlayerView.prototype.seek = function(time) {
  fetch('/api/audio/seek/' + time);
};

PlayerView.prototype.play = function() {
  fetch('/api/audio/play');
};

PlayerView.prototype.pause = function() {
  fetch('/api/audio/pause');
};

PlayerView.prototype.getPlaybackStatus = function() {
  return fetch('/api/audio/status').then(response => response.json());
};

PlayerView.prototype.getSong = function(filePath) {
  return fetch('/api/songs/info' + filePath).then(response => response.json());
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
