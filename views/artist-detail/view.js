var ArtistDetailView = View.extend(function ArtistDetailView() {
  View.call(this); // super();

  this.content = document.getElementById('content');

  this.content.addEventListener('click', (evt) => {
    var link = evt.target.closest('a[data-file-path]');
    if (link) {
      this.play(link.dataset.filePath);
    }
  });

  this.getArtist().then((songs) => {
    this.songs = songs;
    this.render();
  });
});

// ArtistDetailView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

ArtistDetailView.prototype.title = 'Artists';

ArtistDetailView.prototype.getArtist = function() {
  return fetch('/api/artists/info' + this.params.id).then(response => response.json());
};

ArtistDetailView.prototype.play = function(filePath) {
  fetch('/api/audio/play' + filePath);
};

ArtistDetailView.prototype.render = function() {
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

window.view = new ArtistDetailView();
