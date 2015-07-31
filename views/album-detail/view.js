var AlbumDetailView = View.extend(function AlbumDetailView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
});

// AlbumDetailView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

AlbumDetailView.prototype.render = function() {

};

window.view = new AlbumDetailView();
