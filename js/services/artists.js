importScripts('components/threads/client.js');

var client = threads.client('music-service', new BroadcastChannel('music-service'));

function ArtistsService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  worker.get('/api/artists', stopAfter((request) => {
    return new Promise((resolve) => {
      client.method('getArtists').then((artists) => {
        resolve(new Response(JSON.stringify(artists), {
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  }));
}
