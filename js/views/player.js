function PlayerView() {

}

PlayerView.prototype.play = function() {
  return api.method('play');
};

PlayerView.prototype.render = function() {

};

window.api = client('music-service', window.parent);
window.view = new PlayerView();
