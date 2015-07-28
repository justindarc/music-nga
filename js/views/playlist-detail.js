function PlaylistDetailView() {
  this.content = document.getElementById('content');

  this.params = {};

  window.parent.location.search.substr(1).split('&').forEach((param) => {
    var parts = param.split('=');

    this.params[parts[0]] = parts[1];
  });

  this.getPlaylist().then((playlist) => {
    this.playlist = playlist;
    this.render();
  });
}

PlaylistDetailView.prototype.getPlaylist = function() {
  return fetch('/api/playlists/' + this.params.id).then(response => response.json());
};

PlaylistDetailView.prototype.render = function() {
  var html = '';

  this.playlist.songs.forEach((song) => {
    var template =
`<a is="music-list-item"
    href="/player?id=${song.name}"
    title="${song.title}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new PlaylistDetailView();
