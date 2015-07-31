var ArtistDetailView = View.extend(function ArtistDetailView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
});

// ArtistDetailView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

ArtistDetailView.prototype.render = function() {

};

window.view = new ArtistDetailView();
