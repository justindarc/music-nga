var PlaylistsView = View.extend(function PlaylistsView() {
  View.call(this); // super();

  this.content = document.getElementById('content');
  this.search = document.getElementById('search');

  this.search.addEventListener('open', () => window.parent.onSearchOpen());
  this.search.addEventListener('close', () => window.parent.onSearchClose());

  this.client = threads.client('music-service', window.parent);

  this.client.on('databaseChange', () => this.update());

  this.update();
});

PlaylistsView.prototype.update = function() {
  this.getPlaylists().then((playlists) => {
    this.playlists = playlists;
    this.render();
  });
};

// PlaylistsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

PlaylistsView.prototype.title = 'Playlists';

PlaylistsView.prototype.getPlaylists = function() {
  return fetch('/api/playlists').then(response => response.json());
};

PlaylistsView.prototype.render = function() {
  View.prototype.render.call(this); // super();

  var html = '';

  this.playlists.forEach((playlist) => {
    var template =
`<a is="music-list-item"
    href="/playlist-detail?id=${playlist.id}"
    title="${playlist.title}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new PlaylistsView();
