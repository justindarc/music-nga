/*global View, threads*/

var debug = 1 ? (...args) => console.log('[AlbumsView]', ...args) : ()=>{};

var AlbumsView = View.extend(function AlbumsView() {
  View.call(this); // super();

  this.search = document.getElementById('search');
  this.list = document.querySelector('gaia-fast-list');

  this.search.addEventListener('open', () => window.parent.onSearchOpen());
  this.search.addEventListener('close', () => window.parent.onSearchClose());

  this.list.configure({
    model: [],
    getSectionName(item) {
      var album = item.metadata.album;
      return album ? album[0].toUpperCase() : '?';
    },

    itemKeys: {
      link: data => `/album-detail?id=${data.name}`,
      title: 'metadata.album'
    }
  });

  this.client = threads.client('music-service', window.parent);
  this.client.on('databaseChange', () => this.update());

  this.update();
  debug('initialized');
});

AlbumsView.prototype.update = function() {
  this.getAlbums().then(albums => {
    debug('got albums', albums);
    this.list.model = albums;
  });
};

// AlbumsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

AlbumsView.prototype.title = 'Albums';

AlbumsView.prototype.getAlbums = function() {
  return fetch('/api/albums')
    .then(response => response.json())
    .then(albums => clean(albums));
};

function clean(items) {
  debug('clean', items);
  return items.map(item => {
    if (!item.metadata.album) item.metadata.album = '?';
    return item;
  });
}

window.view = new AlbumsView();
