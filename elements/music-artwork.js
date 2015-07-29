(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
  #container {
    background-color: #000;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -moz-user-select: none;
  }
  #container > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s linear, visibility 0s linear 0.2s;
  }
  #container > img.active {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s, 0s;
  }
</style>
<div id="container">
  <img class="active">
  <img>
</div>`;

proto.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  shadowRoot.innerHTML = template;

  this.container = shadowRoot.getElementById('container');
};

proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr !== 'src') {
    return;
  }

  var newActiveImage = this.container.querySelector('img:not(.active)');
  var oldActiveImage = this.container.querySelector('img.active');

  newActiveImage.src = newVal;
  newActiveImage.classList.add('active');
  oldActiveImage.classList.remove('active');
};

Object.defineProperty(proto, 'src', {
  get: function() {
    return this.getAttribute('src');
  },

  set: function(value) {
    this.setAttribute('src', value || '');
  }
});

try {
  window.MusicControls = document.registerElement('music-artwork', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
