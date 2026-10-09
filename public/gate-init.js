/* Runs before first paint: if the operator confirmation cookie is valid for this page's minimum age,
   mark <html data-gate="ok"> so the age-gate overlay never flashes for returning visitors. */
(function () {
  try {
    var min = Number(document.documentElement.getAttribute('data-min-age') || '0');
    var c = document.cookie.split('; ').filter(function (x) { return x.indexOf('bud_age=') === 0; })[0];
    if (c) {
      var age = Number(decodeURIComponent(c.slice(8)).split(':')[0]);
      if (age >= min) document.documentElement.setAttribute('data-gate', 'ok');
    }
  } catch (e) { /* ignore */ }
})();
