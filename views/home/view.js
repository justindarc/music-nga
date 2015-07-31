function HomeView() {
  this.content = document.getElementById('content');

  window.addEventListener('destroy', () => this.destroy());
}

HomeView.prototype.destroy = function() {
  this.content = null;
};

HomeView.prototype.render = function() {

};

window.view = new HomeView();
