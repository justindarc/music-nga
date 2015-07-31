var AlbumsView = View.extend(function AlbumsView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
});

// AlbumsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

AlbumsView.prototype.render = function() {

};

window.view = new AlbumsView();
