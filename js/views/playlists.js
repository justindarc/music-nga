function PlaylistsView() {
  this.content = document.getElementById('content');

  this.getPlaylists().then(() => this.render());
}

PlaylistsView.prototype.getPlaylists = function() {
  return fetch('/api/playlists').then((response) => {
    return response.json().then((playlists) => {
      return this.playlists = playlists;
    });
  });
};

PlaylistsView.prototype.render = function() {
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
