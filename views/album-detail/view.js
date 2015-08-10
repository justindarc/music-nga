/*global threads,View*/

var debug = 1 ? (...args) => console.log('[AlbumDetailView]', ...args) : ()=>{};

var AlbumDetailView = View.extend(function AlbumDetailView() {
  View.call(this); // super();

  this.list = document.querySelector('gaia-fast-list');

  this.list.configure({

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
    }
  });

  // Triggers player service to begin playing the track.
  // This works for now, but we might have the PlayerView
  // take care of this task as it's a big more webby :)
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

AlbumDetailView.prototype.update = function() {
  this.getAlbum().then((songs) => {
    debug('got album songs');
    this.list.model = songs;
  });
};

// AlbumDetailView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

AlbumDetailView.prototype.title = 'Albums';

AlbumDetailView.prototype.getAlbum = function() {
  return fetch('/api/albums/info' + this.params.id)
    .then(response => response.json());
};

AlbumDetailView.prototype.play = function(filePath) {
  fetch('/api/audio/play' + filePath);
};

window.view = new AlbumDetailView();
