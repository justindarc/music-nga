function SongsView() {
  this.content = document.getElementById('content');

  this.content.addEventListener('click', (evt) => {
    var link = evt.target.closest('a[data-song-id]');
    if (link) {
      api.method('play', link.dataset.songId);
    }
  });

  this.getSongs().then(() => this.render());
}

SongsView.prototype.getSongs = function() {
  return api.method('getSongs').then((songs) => {
    return this.songs = songs;
  });
};

SongsView.prototype.render = function() {
  var html = '';

  this.songs.forEach((song) => {
    var template =
`<a href="/player?id=${song.name}" data-song-id="${song.name}">
  ${song.metadata.title}
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.api = client('music-service', window.parent);
window.view = new SongsView();
