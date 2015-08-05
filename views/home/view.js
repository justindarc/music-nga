var HomeView = View.extend(function HomeView() {
  View.call(this); // super();

  this.content = document.getElementById('content');

  this.client = threads.client('music-service', window.parent);

  this.client.on('databaseChange', () => this.update());

  this.update();
});

HomeView.prototype.update = function() {
  this.render();
};

// HomeView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

HomeView.prototype.title = 'Music';

HomeView.prototype.render = function() {
  View.prototype.render.call(this); // super();
};

window.view = new HomeView();
