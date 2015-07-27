var audio = document.getElementById('audio');

var service = threads.service('music-service')
  .method('play', play)
  .method('pause', pause)

  .method('getPaused', getPaused)
  .method('getDuration', getDuration)
  .method('getElapsedTime', getElapsedTime)

  .method('getSongs', getSongs)
  .method('getSongFile', getSongFile)

  .listen();

audio.onloadeddata = function() {
  URL.revokeObjectURL(audio.src);
};

audio.onplay = function() {
  service.broadcast('play');
};

audio.onpause = function() {
  service.broadcast('pause');
};

audio.ondurationchange = function() {
  service.broadcast('durationChange', audio.duration);
};

audio.ontimeupdate = function() {
  service.broadcast('elapsedTimeChange', audio.currentTime);
};

function play(songId) {
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
  audio.pause();
}

function getPaused() {
  return new Promise((resolve) => {
    resolve(audio.paused);
  });
}

function getDuration() {
  return new Promise((resolve) => {
    resolve(audio.duration);
  });
}

function getElapsedTime() {
  return new Promise((resolve) => {
    resolve(audio.currentTime);
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
