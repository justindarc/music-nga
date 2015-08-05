var debug = 1 ? (...args) => console.log('[View]', ...args) : ()=>{};

function View() {
  this.params = {};

  window.parent.location.search.substr(1).split('&').forEach((param) => {
    var parts = param.split('=');
    this.params[parts[0]] = parts[1];
  });

  var title = typeof this.title === 'function' ? this.title() : this.title;
  if (title instanceof Promise) {
    title.then(title => window.parent.setHeaderTitle(title));
  }

  else {
    window.parent.setHeaderTitle(title);
  }

  window.addEventListener('click', e => {
    var link = e.target.closest('a');
    if (link) {
      debug('link clicked');
      e.preventDefault();
      window.parent.navigateToURL(link.getAttribute('href'));
    }
  });

  window.addEventListener('destroy', () => this.destroy());
}

View.prototype.destroy = function() {
  Object.getOwnPropertyNames(this).forEach(prop => this[prop] = null);
};

View.prototype.title = '';

View.prototype.render = function() {
  if (window.frameElement) {
    window.frameElement.dispatchEvent(new CustomEvent('rendered'));
  }
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
