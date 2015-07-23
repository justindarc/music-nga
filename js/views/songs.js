var client = threads.client('music-service', window.parent);

function SongsView() {
  this.content = document.getElementById('content');

  this.content.addEventListener('click', (evt) => {
    var link = evt.target.closest('a[data-song-id]');
    if (link) {
      client.method('play', link.dataset.songId);
    }
  });

  this.getSongs().then(() => this.render());
}

SongsView.prototype.getSongs = function() {
  return client.method('getSongs').then((songs) => {
    return this.songs = songs;
  });
};

SongsView.prototype.render = function() {
  var html = '';

  this.songs.forEach((song) => {
    var template =
`<a is="music-list-item"
    href="/player?id=${song.name}"
    title="${song.metadata.title}"
    subtitle="${song.metadata.artist}"
    data-song-id="${song.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new SongsView();
