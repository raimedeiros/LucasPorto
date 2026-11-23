/* ==========================================================
   Eventos do GA4 (um único listener para o site todo)
   - whatsapp_click  → links de WhatsApp (classe js-wa, wa.me, api.whatsapp.com
                       e grupos chat.whatsapp.com). Parâmetros: page, section, plano
   - bio_link_click  → links da /bio/ com data-link-name. Parâmetro: link_name
   - Só envia se o GA estiver ativo (pessoa aceitou os cookies; ver consent.js).
   - Carregar DEPOIS de wa.js e ANTES de consent.js (ordem dos listeners).
   Detalhes em TRACKING.md.
   ========================================================== */
(function () {
  'use strict';

  var WA_SELECTOR = 'a.js-wa, a[href*="wa.me/"], a[href*="api.whatsapp.com"], a[href*="chat.whatsapp.com"]';

  // home, bio, velocity, privacidade…
  function pageName() {
    var seg = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
    return seg.length ? seg[seg.length - 1] : 'home';
  }

  function sectionOf(a) {
    var el = a.closest('[data-section]');
    return el ? el.getAttribute('data-section') : '';
  }

  function opensSameTab(a, e) {
    return a.target !== '_blank' && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;
  }

  document.addEventListener('click', function (e) {
    if (typeof window.gtag !== 'function') return; // sem consentimento: não rastreia
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;

    var events = [];
    var page = pageName();

    if (a.matches(WA_SELECTOR)) {
      events.push(['whatsapp_click', {
        page: page,
        section: sectionOf(a),
        plano: a.dataset.plan || ''
      }]);
    }
    var linkName = a.getAttribute('data-link-name');
    if (linkName) {
      events.push(['bio_link_click', { page: page, link_name: linkName }]);
    }
    if (!events.length) return;

    // Link na mesma aba: segura a navegação até o GA confirmar (máx. 300 ms)
    var sameTab = opensSameTab(a, e) && !e.defaultPrevented;
    var href = a.href;
    var go = null;
    if (sameTab) {
      e.preventDefault();
      var done = false;
      go = function () { if (!done) { done = true; location.href = href; } };
      setTimeout(go, 300);
    }

    events.forEach(function (ev, i) {
      var params = ev[1];
      params.transport_type = 'beacon';
      if (go && i === events.length - 1) params.event_callback = go;
      window.gtag('event', ev[0], params);
    });
  }, true);
})();
