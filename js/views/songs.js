function SongsView() {
  this.content = document.getElementById('content');

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
`<a href="/player?id=${song.name}">
  ${song.metadata.title}
</a>`;

    html += template;
  });

  this.content.innerHTML = html;
};

// window.api = client('music-service', window.parent.document.getElementById('endpoint'));
window.api = client('music-service', document.getElementById('endpoint'));
window.view = new SongsView();
