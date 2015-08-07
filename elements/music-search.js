(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
  #container {
    position: relative;
  }
  #form {
    background-color: #202020;
    position: relative;
    width: 100%;
    height: 3.7rem;
    overflow: hidden;
  }
  #form > input,
  #form > button {
    background: none;
    border: none;
    font-size: 1.6rem;
    position: relative;
    height: 100%;
    vertical-align: top;
  }
  #input {
    color: #fff;
    line-height: 4rem;
    margin: 0;
    padding: 0 0 0 3rem;
    width: calc(100% - 11.6rem);
  }
  #clear {
    color: #8f9091;
    padding: 0 0.6rem;
    width: 4rem;
    pointer-events: none;
  }
  #input:focus + #clear,
  #clear:active {
    pointer-events: auto;
  }
  #clear:active:before,
  #input:focus + #clear:before {
    content: 'close';
  }
  #close {
    color: #00aac5;
    font-style: italic;
    line-height: 100%;
    padding: 0 1.5rem;
    width: 7rem;
  }
  #close:before {
    content: '';
    background-color: #c7c7c7;
    position: absolute;
    top: 0.7rem;
    bottom: 0.7rem;
    left: -0.1rem;
    width: 0.1rem;
  }
  #results {
    background-color: #000;
    position: absolute;
    top: 3.7rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 3.7rem);
    z-index: 99999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s linear, visibility 0s linear 0.2s;
  }
  #results.active {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s, 0s;
  }
</style>
<div id="container">
  <form id="form" role="search">
    <input type="search" id="input" placeholder="Search Music" x-inputmode="verbatim">
    <button type="reset" id="clear" data-icon="search"></button>
    <button type="button" id="close">close</button>
  </form>
  <section id="results">

  </section>
</div>`;

proto.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  shadowRoot.innerHTML = template;

  var iconsLink = document.querySelector('link[href$="gaia-icons-embedded.css"]');
  var iconsHref = iconsLink && iconsLink.href;
  if (iconsHref) {
    fetch(iconsHref).then((response) => {
      response.text().then((icons) => {
        shadowRoot.querySelector('style').innerHTML += icons;
      });
    });
  }

  var $id = shadowRoot.getElementById.bind(shadowRoot);

  this.els = {
    container: $id('container'),
    form:      $id('form'),
    input:     $id('input'),
    clear:     $id('clear'),
    close:     $id('close'),
    results:   $id('results')
  };

  this.els.container.addEventListener('click', (evt) => {
    var button = evt.target.closest('button');
    switch (button && button.id) {
      case 'clear':
        this.clear();
        break;
      case 'close':
        this.close();
        break;
    }
  });

  this.els.input.addEventListener('focus', () => this.open());

  this.scrollOutOfView();
};

proto.scrollOutOfView = function() {
  if (this.nextElementSibling) {
    this.nextElementSibling.scrollIntoView();
  }
};

proto.clear = function() {
  this.els.form.reset();
  this.els.input.focus();
};

proto.open = function() {
  this.els.input.focus();
  window.requestAnimationFrame(() => {
    this.els.results.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  this.dispatchEvent(new CustomEvent('open'));
};

proto.close = function() {
  this.els.form.reset();
  window.requestAnimationFrame(() => {
    this.els.results.classList.remove('active');
    document.body.style.overflow = 'auto';

    window.requestAnimationFrame(() => this.scrollOutOfView());
  });

  this.dispatchEvent(new CustomEvent('close'));
};

try {
  window.MusicSearch = document.registerElement('music-search', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
