var SongsView = View.extend(function SongsView() {
  View.call(this); // super();

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
});

// SongsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

SongsView.prototype.title = 'Songs';

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
    thumbnail="/api/artwork/thumbnail${song.name}"
    data-file-path="${song.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new SongsView();
