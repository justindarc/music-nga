var audio = document.getElementById('audio');

var service = threads.service('music-service')
  .method('play', play)
  .method('pause', pause)

  .method('getSongs', getSongs)
  .method('getSongFile', getSongFile)

  .listen();

function play(songId) {
  console.log('[music-service] play()', songId);

  if (!songId) {
    audio.play();
    return;
  }

  getSongFile(songId).then((file) => {
    audio.src = null;
    audio.load();

    audio.src = URL.createObjectURL(file);
    audio.load();
    audio.play();
  });
}

function pause() {
  console.log('[music-service] pause()');
}

function getSongs() {
  return new Promise((resolve) => {
    var songs = [];

    Database.enumerate('metadata.title', null, 'next', (song) => {
      if (!song) {
        resolve(songs);
        return;
      }

      songs.push(song);
    });
  });
}

function getSongFile(songId) {
  return Database.getFile(songId);
}

Database.init();
