function ArtistDetailView() {
  this.content = document.getElementById('content');

  window.addEventListener('destroy', () => this.destroy());
}

ArtistDetailView.prototype.destroy = function() {
  this.content = null;
};

ArtistDetailView.prototype.render = function() {

};

window.view = new ArtistDetailView();
