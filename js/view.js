function View() {
  this.params = {};

  window.parent.location.search.substr(1).split('&').forEach((param) => {
    var parts = param.split('=');
    this.params[parts[0]] = parts[1];
  });

  window.addEventListener('click', (evt) => {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();

      window.parent.navigateToURL(evt.target.getAttribute('href'));
    }
  });

  window.addEventListener('destroy', () => this.destroy());
}

View.prototype.destroy = function() {
  Object.getOwnPropertyNames(this).forEach(prop => this[prop] = null);
};

View.extend = function(subclass) {
  subclass.prototype = Object.create(View.prototype, {
    constructor: {
      value: subclass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  // subclass.__proto__ = View;

  return subclass;
};
