var client = threads.client('music-service', window.parent);

function PlayerView() {

}

PlayerView.prototype.play = function() {
  return client.method('play');
};

PlayerView.prototype.render = function() {

};

window.view = new PlayerView();
