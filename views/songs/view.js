/*
global
View,
DataSource,
FastList,
scheduler,
threads
*/

var debug = 0 ? (...args) => console.log('[SongsView]', ...args) : ()=>{};

var SongsView = View.extend(function SongsView() {
  View.call(this); // super();

  this.list = document.querySelector('gaia-fast-list');
  this.search = document.getElementById('search');

  var cached = this.getCache();

  this.list.configure({
    model: cached || [],

    getSectionName(item) {
      return item.metadata.title[0].toUpperCase();
    },

    // We won't need this after <gaia-fast-list>
    // gets proper dynamic <template> input
    populateItem: function(el, i) {
      var data = this.getRecordAt(i);
      var els = {};

      els.link = el.firstChild;
      els.div = els.link.firstChild;
      els.title = els.div.firstChild;
      els.body = els.title.nextSibling;

      els.link.href = `/player?id=${data.name}`;
      els.link.dataset.filePath = data.name;

      els.title.firstChild.data = data.metadata.title;
      els.body.firstChild.data = data.metadata.artist;
    }
  });

  this.search.addEventListener('open', () => window.parent.onSearchOpen());
  this.search.addEventListener('close', () => window.parent.onSearchClose());

  this.list.addEventListener('click', (evt) => {
    var link = evt.target.closest('a[data-file-path]');
    if (link) {
      this.play(link.dataset.filePath);
    }
  });

  this.client = threads.client('music-service', window.parent);
  this.client.on('databaseChange', () => this.update());

  this.update();
});

SongsView.prototype.update = function() {
  this.getSongs().then((songs) => {
    debug('got songs', songs);
    this.list.model = songs;
  }).catch(debug);
};

// SongsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

SongsView.prototype.title = 'Songs';

SongsView.prototype.getSongs = function() {
  console.time('get songs');
  return fetch('/api/songs')
    .then(response => response.json())
    .then(songs => {
      console.timeEnd('get songs');
      this.setCache(songs.slice(0, 10));
      return songs;
    });
};

SongsView.prototype.play = function(filePath) {
  fetch('/api/audio/play' + filePath);
};

SongsView.prototype.setCache = function(items) {
  setTimeout(() => {
    localStorage.setItem('cache:songs', JSON.stringify(items));
  });
};

SongsView.prototype.getCache = function() {
  var items = localStorage.getItem('cache:songs');
  return items && JSON.parse(items);
};

window.view = new SongsView();
