var ArtistsView = View.extend(function ArtistsView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
});

// ArtistsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

ArtistsView.prototype.render = function() {

};

window.view = new ArtistsView();
