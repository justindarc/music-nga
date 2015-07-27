var audio = document.getElementById('audio');

var service = threads.service('music-service')
  .method('play', play)
  .method('pause', pause)

  .method('getCurrentSongDuration', getCurrentSongDuration)

  .method('getSongs', getSongs)
  .method('getSongFile', getSongFile)

  .method('testMethod', function() {
    return new Promise((resolve) => {
      resolve('This result was sent from the service endpoint');
    });
  })

  .listen();

function play(songId) {
  console.log('[music-service] play()', songId);

  if (!songId) {
    audio.play();
    return;
  }

  getSongFile(songId).then((file) => {
    audio.src = null;
    audio.onloadeddata = null;
    audio.load();

    audio.src = URL.createObjectURL(file);
    audio.onloadeddata = () => {
      service.broadcast('loadedSong');
      audio.play();
    };
    audio.load();
  });
}

function pause() {
  console.log('[music-service] pause()');
}

function getCurrentSongDuration() {
  return new Promise((resolve) => {
    resolve(audio.duration);
  });
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
