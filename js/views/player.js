var client = threads.client('music-service', window.parent);

function PlayerView() {
  this.seekBar = document.getElementById('seek-bar');

  client.method('getCurrentSongDuration').then((duration) => {
    this.seekBar.duration = duration;
  });
}

PlayerView.prototype.play = function() {
  return client.method('play');
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
