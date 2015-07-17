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

// var api = client('music-service', document.getElementById('endpoint'));

var views = {};

var header = document.getElementById('header');
var viewStack = document.getElementById('view-stack');
var tabBar = document.getElementById('tab-bar');

header.addEventListener('action', (evt) => {
  if (evt.detail.type === 'back' && viewStack.views.length > 1) {
    viewStack.popView();
    window.history.back();
  }
});

viewStack.addEventListener('change', (evt) => {
  var view = evt.detail.view;
  var viewId = view && view.dataset.viewId;
  var backButton = header.els.actionButton;

  document.body.dataset.activeViewId = viewId;

  backButton.style.visibility = viewStack.views.length < 2 ? 'hidden' : 'visible';
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
  var parts = url.split('/');
  parts.shift();

  var viewId = parts[0].split('?')[0];
  var view = getViewById(viewId);

  if (replaceRoot) {
    viewStack.setRootView(view);
  }

  else {
    viewStack.pushView(view);
  }

  window.history.pushState(null, null, url);
}

function boot() {
  var url = window.location.href.substring(window.location.origin.length);
  if (url === '/') {
    url = '/' + tabBar.firstElementChild.dataset.viewId;
  }

  navigateToURL(url, true);
}
