function AlbumsView() {
  this.content = document.getElementById('content');

  window.addEventListener('destroy', () => this.destroy());
}

AlbumsView.prototype.destroy = function() {
  this.content = null;
};

AlbumsView.prototype.render = function() {

};

window.view = new AlbumsView();
