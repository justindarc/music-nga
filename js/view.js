window.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'A') {
    evt.preventDefault();

    window.parent.navigateToURL(evt.target.getAttribute('href'));
  }
});
