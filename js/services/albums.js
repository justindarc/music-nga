importScripts('components/threads/client.js');

var client = threads.client('music-service', new BroadcastChannel('music-service'));

function AlbumsService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  worker.get('/api/albums', stopAfter((request) => {
    return new Promise((resolve) => {
      client.method('getAlbums').then((albums) => {
        resolve(new Response(JSON.stringify(albums), {
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  }));

  worker.get('/api/albums/info/:filePath', stopAfter((request) => {
    return new Promise((resolve) => {
      var filePath = '/' + request.parameters.filePath.replace(/\%20/g, ' ');
      client.method('getAlbum', filePath)
        .then((songs) => {
          resolve(new Response(JSON.stringify(songs), {
            headers: { 'Content-Type': 'application/json' }
          }));
        })
        .catch((error) => {
          resolve(new Response(null, { status: 404 }));
        });
    });
  }));
}
