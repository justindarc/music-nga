var PlaylistDetailView = View.extend(function PlaylistDetailView() {
  View.call(this); // super();

  this.content = document.getElementById('content');

  this.getPlaylist().then((playlist) => {
    this.playlist = playlist;
    this.render();
  });
});

// PlaylistDetailView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

PlaylistDetailView.prototype.getPlaylist = function() {
  return fetch('/api/playlists/' + this.params.id).then(response => response.json());
};

PlaylistDetailView.prototype.render = function() {
  var html = '';

  this.playlist.songs.forEach((song) => {
    var template =
`<a is="music-list-item"
    href="/player?id=${song.name}"
    title="${song.title}"
    thumbnail="/api/artwork/thumbnail${song.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new PlaylistDetailView();
