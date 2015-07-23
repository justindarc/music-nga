navigator.serviceWorker.getRegistration().then((registration) => {
  if (registration && registration.active) {
    console.log('ServiceWorker already registered');
    boot();
    return;
  }

  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => {
      console.log('ServiceWorker registered successfully');
      window.location.reload();
    })
    .catch((error) => {
      console.error('ServiceWorker registration failed', error);
    });
});

var service = threads.service('*')
  .on('message', message => message.forward(document.getElementById('endpoint')))
  .listen();

var views = {};

var header = document.getElementById('header');
var viewStack = document.getElementById('view-stack');
var tabBar = document.getElementById('tab-bar');

header.addEventListener('action', (evt) => {
  if (evt.detail.type === 'back' && viewStack.states.length > 1) {
    viewStack.popView();
    window.history.back();
  }
});

viewStack.addEventListener('change', (evt) => {
  var view = evt.detail.view;
  var viewId = view && view.dataset.viewId;
  var backButton = header.els.actionButton;

  document.body.dataset.activeViewId = viewId;

  backButton.style.visibility = viewStack.states.length < 2 ? 'hidden' : 'visible';
});

tabBar.addEventListener('change', (evt) => {
  var tab = evt.detail.selectedElement;
  var viewId = tab.dataset.viewId;
  var url = viewId ? '/' + viewId : '/';

  navigateToURL(url, true);
});

function getViewById(viewId) {
  var view = views[viewId];
  if (view) {
    return view;
  }

  view = views[viewId] = document.createElement('iframe');
  view.dataset.viewId = viewId;
  view.src = 'views/' + viewId + '.html';

  return view;
}

function navigateToURL(url, replaceRoot) {
  var path = url.substring(1);
  var parts = path.split('?');

  var viewId = parts.shift();
  var params = parseQueryString(parts.join('?'));
  var view = getViewById(viewId);

  var tab = tabBar.querySelector('button[data-view-id="' + viewId + '"]');
  if (tab) {
    tabBar.selectedElement = tab;
  }

  if (replaceRoot) {
    viewStack.setRootView(view, params);
  }

  else {
    viewStack.pushView(view, params);
  }

  window.history.pushState(null, null, url);
}

function parseQueryString(queryString) {
  var query = {};

  var params = queryString.split('&');
  params.forEach((param) => {
    var parts = param.split('=');
    var key = parts.shift();
    var value = parts.join('=');

    query[key] = value || true;
  });

  return query;
}

function boot() {
  var url = window.location.href.substring(window.location.origin.length);
  if (url === '/' || url === '/index.html') {
    url = '/' + tabBar.firstElementChild.dataset.viewId;
  }

  navigateToURL(url, true);
}
