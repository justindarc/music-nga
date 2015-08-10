/*global threads,View*/

var debug = 1 ? (...args) => console.log('[ArtistsView]', ...args) : () => {};

var ArtistsView = View.extend(function ArtistsView() {
  View.call(this); // super();

  this.list = document.querySelector('gaia-fast-list');
  this.search = document.getElementById('search');

  this.search.addEventListener('open', () => window.parent.onSearchOpen());
  this.search.addEventListener('close', () => window.parent.onSearchClose());

  this.list.configure({
    getSectionName(item) {
      return item.metadata.artist[0].toUpperCase();
    },

    itemKeys: {
      link: data => `/artist-detail?id=${data.name}`,
      title: 'metadata.artist'
    }
  });

  this.client = threads.client('music-service', window.parent);
  this.client.on('databaseChange', () => this.update());
  this.update();
});

ArtistsView.prototype.update = function() {
  this.getArtists().then((artists) => {
    debug('got artists', artists);
    this.list.model = artists;
  });
};

// ArtistsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

ArtistsView.prototype.title = 'Artists';

ArtistsView.prototype.getArtists = function() {
  return fetch('/api/artists').then(response => response.json());
};

window.view = new ArtistsView();
