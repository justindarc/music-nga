function SongsView() {
  this.content = document.getElementById('content');

  this.content.addEventListener('click', (evt) => {
    var link = evt.target.closest('a[data-file-path]');
    if (link) {
      this.play(link.dataset.filePath);
    }
  });

  this.getSongs().then((songs) => {
    this.songs = songs;
    this.render();
  });
}

SongsView.prototype.getSongs = function() {
  return fetch('/api/songs').then(response => response.json());
};

SongsView.prototype.play = function(filePath) {
  fetch('/api/audio/play' + filePath);
};

SongsView.prototype.render = function() {
  var html = '';

  this.songs.forEach((song) => {
    var template =
`<a is="music-list-item"
    href="/player?id=${song.name}"
    title="${song.metadata.title}"
    subtitle="${song.metadata.artist}"
    data-file-path="${song.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new SongsView();
