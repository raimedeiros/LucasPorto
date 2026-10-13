/* ==========================================================
   Aviso de cookies + Google Analytics (GA4)
   - O GA só é carregado DEPOIS que a pessoa clica em "Aceitar".
   - "Recusar" não carrega nada. A escolha fica salva no navegador.
   - Uso: <script src="../assets/consent.js?v=1" data-privacy="../privacidade/" defer></script>
   - Para reabrir o aviso: window.lpConsent.reset()
   ========================================================== */
(function () {
  'use strict';

  var GA_ID = 'G-3M9JLKCE6S';
  var KEY = 'lp_consent'; // 'granted' | 'denied'

  var script = document.currentScript;
  var privacyUrl = (script && script.dataset.privacy) || '/privacidade/';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* navegação privada: só vale para esta visita */ }
  }

  // ---------- Google Analytics ----------
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Cliques nos links de WhatsApp viram evento "whatsapp_click" (com o plano, quando houver)
  document.addEventListener('click', function (e) {
    if (!gaLoaded) return;
    var a = e.target.closest && e.target.closest('a[href*="wa.me"], a[href*="chat.whatsapp.com"]');
    if (!a) return;
    window.gtag('event', 'whatsapp_click', {
      link_tipo: a.href.indexOf('chat.whatsapp.com') > -1 ? 'grupo' : 'conversa',
      plano: a.dataset.plan || '',
      texto: (a.textContent || '').trim().slice(0, 60),
      pagina: location.pathname
    });
  }, true);

  // ---------- Aviso ----------
  var css = '' +
    '.lp-consent{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:200;' +
    'display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;max-width:520px;margin:0 auto;padding:12px 14px;' +
    'border-radius:14px;background:rgba(20,20,20,.96);color:#e6e6e6;border:1px solid #333;' +
    'box-shadow:0 12px 32px -12px rgba(0,0,0,.6);font:400 .8rem/1.45 Inter,system-ui,-apple-system,sans-serif;' +
    'animation:lpIn .4s cubic-bezier(.2,.8,.2,1) both}' +
    '.lp-consent p{margin:0;flex:1 1 220px}' +
    '.lp-consent a{color:#fff;text-decoration:underline;text-underline-offset:2px}' +
    '.lp-consent__btns{display:flex;gap:8px;margin-left:auto}' +
    '.lp-consent button{font:600 .78rem/1 Inter,system-ui,sans-serif;padding:9px 14px;border-radius:999px;cursor:pointer;' +
    'border:1px solid #fff;min-height:36px}' +
    '.lp-consent__no{background:transparent;color:#fff}' +
    '.lp-consent__ok{background:#fff;color:#111}' +
    '.lp-consent button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    'html.lp-consent-open .fab{bottom:calc(var(--lp-consent-h,0px) + 24px)!important}' +
    '@keyframes lpIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.lp-consent{animation:none}}';

  function showBanner() {
    if (document.querySelector('.lp-consent')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'lp-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies do Google Analytics para entender como o site é usado. ' +
      '<a href="' + privacyUrl + '">Saiba mais</a></p>' +
      '<div class="lp-consent__btns">' +
      '<button type="button" class="lp-consent__no">Recusar</button>' +
      '<button type="button" class="lp-consent__ok">Aceitar</button>' +
      '</div>';
    document.body.appendChild(box);

    var root = document.documentElement;
    root.classList.add('lp-consent-open');
    root.style.setProperty('--lp-consent-h', box.offsetHeight + 'px');

    function close(value) {
      save(value);
      box.remove();
      root.classList.remove('lp-consent-open');
      if (value === 'granted') loadGA();
    }
    box.querySelector('.lp-consent__ok').addEventListener('click', function () { close('granted'); });
    box.querySelector('.lp-consent__no').addEventListener('click', function () { close('denied'); });
  }

  // apaga cookies do GA (_ga, _ga_XXXX) ao revogar o consentimento
  function clearGACookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  window.lpConsent = {
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      clearGACookies();
      if (gaLoaded) { location.reload(); return; } // descarrega o GA já ativo
      showBanner();
    }
  };

  var choice = read();
  if (choice === 'granted') loadGA();
  else if (choice !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
