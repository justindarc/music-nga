var ArtistsView = View.extend(function ArtistsView() {
  View.call(this); // super();

  this.content = document.getElementById('content');

  this.getArtists().then((artists) => {
    this.artists = artists;
    this.render();
  });
});

// ArtistsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

ArtistsView.prototype.title = 'Artists';

ArtistsView.prototype.getArtists = function() {
  return fetch('/api/artists').then(response => response.json());
};

ArtistsView.prototype.render = function() {
  var html = '';

  this.artists.forEach((artist) => {
    var template =
`<a is="music-list-item"
    href="/artist-detail?id=${artist.name}"
    title="${artist.metadata.artist}"
    thumbnail="/api/artwork/thumbnail${artist.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new ArtistsView();
