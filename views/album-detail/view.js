function AlbumDetailView() {
  this.content = document.getElementById('content');

  window.addEventListener('destroy', () => this.destroy());
}

AlbumDetailView.prototype.destroy = function() {
  this.content = null;
};

AlbumDetailView.prototype.render = function() {

};

window.view = new AlbumDetailView();
