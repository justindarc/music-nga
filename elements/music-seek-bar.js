(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
  #container {
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-flow: row nowrap;
    position: relative;
    width: 100%;
    height: 4.2rem;
  }
  #container > span {
    display: inline-block;
    position: relative;
    height: 100%;
  }
  #elapsed-time,
  #remaining-time {
    color: #e7e7e7;
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 4.2rem;
    vertical-align: top;
    flex: 0 0 auto;
    width: 5.3rem;
  }
  #elapsed-time {
    padding-left: 1.5rem;
  }
  #remaining-time {
    padding-right: 1.5rem;
    text-align: right;
  }
  #seek-bar {
    flex: 1 0 auto;
    z-index: 1;
  }
  #seek-bar-progress {
    background-color: #a6b4b7;
    border: none;
    border-radius: 0;
    position: absolute;
    top: calc(50% - 0.1rem);
    left: 0;
    width: 100%;
    height: 0.1rem;
    pointer-events: none;
    -moz-appearance: none;
  }
  #seek-bar-progress::-moz-progress-bar {
    background-color: #01c5ed;
  }
  #seek-bar-indicator {
    position: absolute;
    top: calc(50% - 1.15rem);
    left: -1.15rem;
    width: 2.3rem;
    height: 2.3rem;
    pointer-events: none;
  }
  #seek-bar-indicator:after {
    content: '';
    background-color: #fff;
    border: 0.1rem solid #fff;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 1.25rem);
    left: calc(50% - 1.15rem);
    width: 2.1rem;
    height: 2.1rem;
  }
  #seek-bar-indicator.highlight:before {
    content: '';
    background-color: #00caf2;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 3.05rem);
    left: calc(50% - 3.05rem);
    width: 6.1rem;
    height: 6.1rem;
  }
</style>
<div id="container">
  <span id="elapsed-time"></span>
  <span id="seek-bar">
    <progress id="seek-bar-progress"></progress>
    <div id="seek-bar-indicator"></div>
  </span>
  <span id="remaining-time"></span>
</div>`;

proto.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  shadowRoot.innerHTML = template;

  var $id = shadowRoot.getElementById.bind(shadowRoot);

  this.els = {
    container:        $id('container'),
    elapsedTime:      $id('elapsed-time'),
    seekBar:          $id('seek-bar'),
    seekBarProgress:  $id('seek-bar-progress'),
    seekBarIndicator: $id('seek-bar-indicator'),
    remainingTime:    $id('remaining-time')
  };

  var seekBar = this.els.seekBar;

  seekBar.addEventListener('touchstart', (evt) => {
    seekBar.addEventListener('touchmove', touchmoveHandler);
    seekBar.addEventListener('touchend', touchendHandler);

    this.els.seekBarIndicator.classList.add('highlight');

    touchmoveHandler(evt);
  });

  var touchmoveHandler = (evt) => {
    var touch = evt.touches[0];
    var percent = clamp(0, 1, (touch.clientX - seekBar.offsetLeft) / seekBar.offsetWidth);

    if (document.documentElement.dir === 'rtl') {
      this.remainingTime = percent * this.duration;
    }

    else {
      this.elapsedTime = percent * this.duration;
    }
  };

  var touchendHandler = (evt) => {
    seekBar.removeEventListener('touchmove', touchmoveHandler);
    seekBar.removeEventListener('touchend', touchendHandler);

    this.els.seekBarIndicator.classList.remove('highlight');
  };

  this.duration = null;
  this.elapsedTime = null;
  this.remainingTime = null;
};

Object.defineProperty(proto, 'duration', {
  get: function() {
    return this._duration;
  },

  set: function(value) {
    if (isNaN(value)) {
      this._duration = null;
      this.remainingTime = null;
      return;
    }

    this._duration = value
    this.remainingTime = this._duration - this._elapsedTime;
  }
});

Object.defineProperty(proto, 'elapsedTime', {
  get: function() {
    return this._elapsedTime;
  },

  set: function(value) {
    if (isNaN(value)) {
      this._elapsedTime = null;
      this.remainingTime = null;
      return;
    }

    this._elapsedTime = value;
    this.remainingTime = this._duration - this._elapsedTime;
  }
});

Object.defineProperty(proto, 'remainingTime', {
  get: function() {
    return this._remainingTime;
  },

  set: function(value) {
    var indeterminate = isNaN(value) || isNaN(this._duration);
    if (indeterminate) {
      this._remainingTime = null;
      this._elapsedTime = null;
    }

    else {
      this._remainingTime = value;
      this._elapsedTime = this._duration - this._remainingTime;
    }

    this.els.remainingTime.textContent = '-' + formatTime(this._remainingTime);
    this.els.elapsedTime.textContent = formatTime(this._elapsedTime);

    if (indeterminate) {
      return;
    }

    var percent = this._elapsedTime / this._duration;
    var x = this.els.seekBar.offsetWidth * percent;

    if (document.documentElement.dir === 'rtl') {
      x = this.els.seekBar.offsetWidth - x;
    }

    this.els.seekBarIndicator.style.transform = 'translateX(' + x + 'px)';
  }
});

function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

function formatTime(secs) {
  if (isNaN(secs)) {
    return '--:--';
  }

  secs = Math.floor(secs);

  var formatedTime;
  var seconds = secs % 60;
  var minutes = Math.floor(secs / 60) % 60;
  var hours = Math.floor(secs / 3600);

  if (hours === 0) {
    formatedTime =
      (minutes < 10 ? '0' + minutes : minutes) + ':' +
      (seconds < 10 ? '0' + seconds : seconds);
  } else {
    formatedTime =
      (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes) + ':' +
      (seconds < 10 ? '0' + seconds : seconds);
  }

  return formatedTime;
}

try {
  window.MusicSeekBar = document.registerElement('music-seek-bar', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
