// Applies the saved or system theme before first paint, so the page never
// flashes the wrong colors. Loaded as a file so the CSP can stay 'self' only.
(function () {
  try {
    var t = localStorage.getItem('portfolio-theme');
    if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) {}
})();
