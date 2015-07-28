importScripts('components/threads/client.js');

var client = threads.client('music-service', new BroadcastChannel('music-service'));

function SongsService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  worker.get('/api/songs', stopAfter((request) => {
    return new Promise((resolve) => {
      client.method('getSongs').then((songs) => {
        resolve(new Response(JSON.stringify(songs), {
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  }));

  worker.get('/api/songs/artwork/:filePath', stopAfter((request) => {
    return new Promise((resolve) => {
      var filePath = '/' + request.parameters.filePath.replace(/\%20/g, ' ');
      client.method('getSongArtwork', filePath)
        .then((file) => {
          resolve(new Response(file, {
            headers: { 'Content-Type': 'application/octet-stream' }
          }));
        })
        .catch((error) => {
          resolve(new Response(null, { status: 404 }));
        });
    });
  }));
}
