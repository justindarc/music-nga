var HomeView = View.extend(function HomeView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
});

// HomeView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

HomeView.prototype.render = function() {

};

window.view = new HomeView();
