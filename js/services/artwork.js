importScripts('components/threads/client.js');

var client = threads.client('music-service', new BroadcastChannel('music-service'));

function ArtworkService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  worker.get('/api/artwork/original/:filePath', stopAfter((request) => {
    return new Promise((resolve) => {
      var filePath = '/' + request.parameters.filePath.replace(/\%20/g, ' ');
      client.method('getSongArtwork', filePath)
        .then((url) => {
          return getBlobFromURL(url).then((file) => {
            resolve(new Response(file, {
              headers: { 'Content-Type': file.type || 'application/octet-stream' }
            }));
          });
        })
        .catch((error) => {
          resolve(new Response('', { status: 404 }));
        });
    });
  }));

  worker.get('/api/artwork/thumbnail/:filePath', stopAfter((request) => {
    return new Promise((resolve) => {
      var filePath = '/' + request.parameters.filePath.replace(/\%20/g, ' ');
      client.method('getSongThumbnail', filePath)
        .then((url) => {
          return getBlobFromURL(url).then((file) => {
            resolve(new Response(file, {
              headers: { 'Content-Type': file.type || 'application/octet-stream' }
            }));
          });
        })
        .catch((error) => {
          resolve(new Response('', { status: 404 }));
        });
    });
  }));
}

function getBlobFromURL(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function() {
      resolve(xhr.response);
    };
    // I don't think onerror usually gets called, but let's play it safe.
    xhr.onerror = function() {
      reject(null);
    };

    xhr.send();
  });
}
