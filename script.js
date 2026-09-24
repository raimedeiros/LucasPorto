(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5561983435171';
  var WHATSAPP_MESSAGE = 'Li sobre seu trabalho no instagram e gostaria de mais informações';
  // Mensagem usada nos botões de cada plano (data-plan no HTML)
  var WHATSAPP_PLAN_MESSAGE = 'Li sobre seu trabalho no instagram e fiquei interessado no plano {plano}. Gostaria de mais informações';

  function waUrl(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('js');

  // Botões de WhatsApp: mensagem geral, ou mensagem com o plano quando houver data-plan
  document.querySelectorAll('.js-wa').forEach(function (a) {
    var plan = a.dataset.plan;
    a.href = waUrl(plan ? WHATSAPP_PLAN_MESSAGE.replace('{plano}', plan) : WHATSAPP_MESSAGE);
  });

  // Clicar em qualquer parte do card abre o WhatsApp daquele plano
  document.querySelectorAll('.plan, .list__item').forEach(function (card) {
    var link = card.querySelector('.plan__cta');
    if (!link) return;
    card.classList.add('is-clickable');
    card.addEventListener('click', function (e) {
      if (e.target.closest('a') || window.getSelection().toString()) return;
      link.click();
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Reveal ao rolar ----------
  var reveals = document.querySelectorAll('.reveal');

  // pequeno escalonamento entre itens irmãos (cards de uma mesma grid)
  document.querySelectorAll('.plans, .list').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      el.style.setProperty('--d', (i * 0.08) + 's');
    });
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---------- Abas: estado ativo conforme a seção visível ----------
  var tabs = document.querySelectorAll('.tab[data-target]');
  var sections = Array.prototype.map.call(tabs, function (t) {
    return document.getElementById(t.dataset.target);
  });

  function setActive(id) {
    tabs.forEach(function (t) {
      var on = t.dataset.target === id;
      t.classList.toggle('is-active', on);
      if (on) {
        t.setAttribute('aria-current', 'true');
        // mantém a aba ativa visível no scroll horizontal (mobile)
        var bar = t.parentElement;
        if (bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: t.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      } else {
        t.removeAttribute('aria-current');
      }
    });
  }

  function onScroll() {
    var offset = window.innerHeight * 0.35;
    var current = sections[0].id;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top - offset <= 0) current = s.id;
    });
    // chegou ao fim da página: ativa a última
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }
    if (current !== lastActive) { lastActive = current; setActive(current); }

    fab.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.7 && !footerVisible);
  }

  var lastActive = null;
  var fab = document.querySelector('.fab');
  var hero = document.querySelector('.hero');
  var footerVisible = false;

  // esconde o botão flutuante quando o CTA final já está na tela
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      footerVisible = entries[0].isIntersecting;
      onScroll();
    }).observe(document.querySelector('.final'));
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // clique nas abas: scroll suave (CSS scroll-behavior faz o resto) + move o foco p/ a seção
  tabs.forEach(function (t) {
    t.addEventListener('click', function (e) {
      var target = document.getElementById(t.dataset.target);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + target.id);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  onScroll();
})();
