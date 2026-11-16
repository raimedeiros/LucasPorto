/* ==========================================================
   Links de WhatsApp sem o número no código da página
   - O número fica embaralhado aqui e só vira link no momento do clique,
     então robôs que leem o HTML (ou o DOM carregado) não o encontram.
   - Cada link usa a classe "js-wa". Sem JavaScript, o href de fallback
     do HTML (Instagram) é usado.
   - data-plan="…"     → mensagem com o nome do plano
   - data-wa-text="…"  → mensagem personalizada ("" = sem mensagem)
   - sem atributo      → mensagem geral
   ========================================================== */
(function () {
  'use strict';

  // número invertido e em pedaços (para trocar: inverta o número com DDI e divida em partes)
  var PARTS = ['171534', '389', '1655'];

  var MESSAGE = 'Li sobre seu trabalho no instagram e gostaria de mais informações';
  var PLAN_MESSAGE = 'Li sobre seu trabalho no instagram e fiquei interessado no plano {plano}. Gostaria de mais informações';

  function number() {
    return PARTS.join('').split('').reverse().join('');
  }

  function urlFor(a) {
    var text;
    if (a.hasAttribute('data-wa-text')) text = a.getAttribute('data-wa-text');
    else if (a.dataset.plan) text = PLAN_MESSAGE.replace('{plano}', a.dataset.plan);
    else text = MESSAGE;
    return 'https://wa.me/' + number() + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function arm(e) {
    var a = e.target.closest && e.target.closest('a.js-wa');
    if (a) a.href = urlFor(a);
  }

  // monta o link só na interação (antes da navegação acontecer)
  document.addEventListener('pointerdown', arm, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter') arm(e); }, true);
  document.addEventListener('click', arm, true);
})();
