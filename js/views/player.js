var client = threads.client('music-service', window.parent);

function PlayerView() {
  this.seekBar = document.getElementById('seek-bar');

  client.method('getDuration').then((duration) => {
    this.seekBar.duration = duration;
  });

  client.on('durationChange', (duration) => {
    this.seekBar.duration = duration;
  });

  client.on('elapsedTimeChange', (elapsedTime) => {
    this.seekBar.elapsedTime = elapsedTime;
  });
}

PlayerView.prototype.play = function() {
  return client.method('play');
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
