(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
  #container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #container > iframe {
    border: none;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  #container > iframe.active,
  #container > iframe.push,
  #container > iframe.pop {
    display: block;
  }
  #container > iframe.push,
  #container > iframe.pop {
    transition: transform 0.2s linear;
  }
  #container > iframe.push.in {
    transform: translate(100%, 0);
  }
  #container > iframe.push.in.transition {
    transform: translate(0, 0);
  }
  #container > iframe.push.out {
    transform: translate(0, 0);
  }
  #container > iframe.push.out.transition {
    transform: translate(-100%, 0);
  }
  #container > iframe.pop.in {
    transform: translate(-100%, 0);
  }
  #container > iframe.pop.in.transition {
    transform: translate(0, 0);
  }
  #container > iframe.pop.out {
    transform: translate(0, 0);
  }
  #container > iframe.pop.out.transition {
    transform: translate(100%, 0);
  }
</style>
<div id="container">
</div>`;

proto.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  shadowRoot.innerHTML = template;

  this.container = shadowRoot.querySelector('#container');
  this.container.addEventListener('transitionend', (evt) => {
    var classList = evt.target.classList;
    if (classList.contains('pop') &&
        classList.contains('out')) {
      evt.target.parentNode.removeChild(evt.target);
    }

    classList.remove('push');
    classList.remove('pop');
    classList.remove('in');
    classList.remove('out');
    classList.remove('transition');
  });

  this.views = [];
  this.activeView = null;
};

proto.setRootView = function(view) {
  this.views = [view];

  this.container.innerHTML = '';
  this.container.appendChild(view);

  if (this.activeView) {
    this.activeView.classList.remove('active');
  }

  view.classList.add('active');
  this.activeView = view;

  this.dispatchEvent(new CustomEvent('change', {
    detail: { view: view }
  }));
};

proto.pushView = function(view) {
  window.requestAnimationFrame(() => {
    this.views.push(view);

    this.container.appendChild(view);

    var oldActiveView = this.activeView;
    if (oldActiveView) {
      oldActiveView.classList.remove('active');
      oldActiveView.classList.add('push');
      oldActiveView.classList.add('out');
    }

    this.activeView = view;
    this.activeView.classList.add('active');
    this.activeView.classList.add('push');
    this.activeView.classList.add('in');

    window.requestAnimationFrame(() => {
      if (oldActiveView) {
        oldActiveView.classList.add('transition');
      }

      this.activeView.classList.add('transition');
    });

    this.dispatchEvent(new CustomEvent('change', {
      detail: { view: this.activeView }
    }));
  });
};

proto.popView = function() {
  if (this.views.length < 2) {
    return;
  }

  window.requestAnimationFrame(() => {
    this.views.pop();

    var oldActiveView = this.activeView;
    oldActiveView.classList.remove('active');
    oldActiveView.classList.add('pop');
    oldActiveView.classList.add('out');

    this.activeView = this.views[this.views.length - 1];
    if (this.activeView) {
      this.activeView.classList.add('active');
      this.activeView.classList.add('pop');
      this.activeView.classList.add('in');
    }

    window.requestAnimationFrame(() => {
      oldActiveView.classList.add('transition');

      if (this.activeView) {
        this.activeView.classList.add('transition');
      }
    });

    this.dispatchEvent(new CustomEvent('change', {
      detail: { view: this.activeView }
    }));
  });
};

try {
  window.MusicViewStack = document.registerElement('music-view-stack', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
