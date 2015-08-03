var AlbumsView = View.extend(function AlbumsView() {
  View.call(this); // super();

  this.content = document.getElementById('content');

  this.getAlbums().then((albums) => {
    this.albums = albums;
    this.render();
  });
});

// AlbumsView.prototype.destroy = function() {
//   View.prototype.destroy.call(this); // super(); // Always call *last*
// };

AlbumsView.prototype.getAlbums = function() {
  return fetch('/api/albums').then(response => response.json());
};

AlbumsView.prototype.render = function() {
  var html = '';

  this.albums.forEach((album) => {
    var template =
`<a is="music-list-item"
    href="/album-detail?id=${album.name}"
    title="${album.metadata.album}"
    thumbnail="/api/artwork/thumbnail${album.name}">
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

window.view = new AlbumsView();
