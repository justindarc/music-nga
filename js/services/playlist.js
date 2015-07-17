function PlaylistService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  var playlists = [
    {
      id: 1,
      title: 'Playlist 1',
      songs: [
        {
          id: 1,
          artist: 'Artist 1',
          album: 'Album 1',
          title: 'Song 1'
        },
        {
          id: 2,
          artist: 'Artist 2',
          album: 'Album 2',
          title: 'Song 2'
        },
        {
          id: 3,
          artist: 'Artist 3',
          album: 'Album 3',
          title: 'Song 3'
        }
      ]
    },
    {
      id: 2,
      title: 'Playlist 2',
      songs: [
        {
          id: 4,
          artist: 'Artist 4',
          album: 'Album 4',
          title: 'Song 4'
        },
        {
          id: 5,
          artist: 'Artist 5',
          album: 'Album 5',
          title: 'Song 5'
        },
        {
          id: 6,
          artist: 'Artist 6',
          album: 'Album 6',
          title: 'Song 6'
        }
      ]
    },
    {
      id: 3,
      title: 'Playlist 3',
      songs: [
        {
          id: 7,
          artist: 'Artist 7',
          album: 'Album 7',
          title: 'Song 7'
        },
        {
          id: 8,
          artist: 'Artist 8',
          album: 'Album 8',
          title: 'Song 8'
        },
        {
          id: 9,
          artist: 'Artist 9',
          album: 'Album 9',
          title: 'Song 9'
        }
      ]
    }
  ];

  worker.get('/api/playlists', stopAfter((request) => {
    return new Response(JSON.stringify(playlists), {
      headers: { 'Content-Type': 'application/json' }
    });
  }));

  worker.get('/api/playlists/:playlistId', stopAfter((request) => {
    var playlist = playlists.find(o => o.id == request.parameters.playlistId);

    return new Response(JSON.stringify(playlist), {
      headers: { 'Content-Type': 'application/json' },
      status: !!playlist ? 200 : 404
    });
  }));
}
