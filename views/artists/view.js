function ArtistsView() {
  this.content = document.getElementById('content');

  window.addEventListener('destroy', () => this.destroy());
}

ArtistsView.prototype.destroy = function() {
  this.content = null;
};

ArtistsView.prototype.render = function() {

};

window.view = new ArtistsView();
