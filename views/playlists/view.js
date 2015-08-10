/*global threads,View*/

var debug = 1 ? (...args) => console.log('[PlaylistsView]', ...args) : () => {};

var PlaylistsView = View.extend(function PlaylistsView() {
  View.call(this); // super();

  this.list = document.querySelector('gaia-fast-list');
  this.search = document.getElementById('search');

  this.search.addEventListener('open', () => window.parent.onSearchOpen());
  this.search.addEventListener('close', () => window.parent.onSearchClose());

  this.list.configure({
    itemKeys: {
      link: data => `/playlist-detail?id=${data.id}`,
      title: 'title'
    }
  });

  this.client = threads.client('music-service', window.parent);
  this.client.on('databaseChange', () => this.update());
  this.update();
});

PlaylistsView.prototype.update = function() {
  this.getPlaylists().then((playlists) => {
    debug('got playlists', playlists);
    this.list.model = playlists;
  });
};

// PlaylistsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

PlaylistsView.prototype.title = 'Playlists';

PlaylistsView.prototype.getPlaylists = function() {
  console.time('get playlists');
  return fetch('/api/playlists')
    .then(response => response.json())
    .then(playlists => {
      console.timeEnd('get playlists');
      return playlists;
    });
};

window.view = new PlaylistsView();
