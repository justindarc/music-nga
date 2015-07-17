var audio = document.getElementById('audio');

service('music-service')
  .method('play', (params) => {
    audio.play();
    console.log('[music-service] play()', params);
  })

  .method('pause', () => {
    console.log('[music-service] pause()');
  })

  .method('getSongs', () => {
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
  })

  .listen();

Database.init();
