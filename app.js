/* Portfólio cinematográfico · rolagem controla o vídeo (vanilla JS, sem build) */
(function () {
  'use strict';
  var C = window.CONFIG;
  var $ = function (id) { return document.getElementById(id); };
  var clamp = function (x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var easeOut = function (p) { return 1 - Math.pow(1 - p, 3); };
  var smooth = function (p) { return p * p * (3 - 2 * p); };

  /* ================= 1. TIMING (segundos do filme) =================
     Medido a partir dos 6 clipes (7+7+6+6+6+6 s, fade de 0,25 s = 36,75 s):
       4,6   termina de virar para a câmera
       13,5  chega no close-up
       17,0  senta na cadeira
       21,8  a mesa para na frente dele
       22,2  começa a digitar
       26,8  levanta e anda para a esquerda
       29,8  para no terço esquerdo
       32,0–33,4 puxa a "tela" invisível para baixo
       34,4  mãos descem
       35,3  começa a acenar
     Cada segmento liga a rolagem a um trecho do filme (t:[de,até], h = alturas de tela).
     de === até é um HOLD: o filme pausa enquanto a seção é lida. */
  var SEGS = [
    { t: [0, 5.6],     h: 1.7 },
    { t: [5.6, 5.6],   h: 1.0, id: 'intro' },
    { t: [5.6, 14.0],  h: 3.0 },
    { t: [14.0, 14.0], h: 1.1, id: 'about' },
    { t: [14.0, 23.2], h: 3.4 },
    { t: [23.2, 23.2], h: 1.2, id: 'work' },
    { t: [23.2, 30.0], h: 2.6 },
    { t: [30.0, 30.0], h: 1.0, id: 'skills' },
    { t: [30.0, 34.4], h: 2.0 },
    { t: [34.4, 34.4], h: 1.0, id: 'resume' },
    { t: [34.4, 36.7], h: 1.2 },
    { t: [36.7, 36.7], h: 1.4, id: 'contact' }
  ];

  /* Janela de cada seção no tempo do filme: [aparece, some] */
  var WIN = {
    intro:   [-3, 9.0],
    about:   [12.0, 17.0],
    work:    [21.0, 26.5],
    skills:  [26.3, 31.0],
    resume:  [32.2, 35.6],
    contact: [35.4, 999]
  };
  var CHIP_START = 26.7, CHIP_STEP = 0.2;     // skills entram enquanto ele anda
  var DROP = [32.3, 33.4];                    // cartão do currículo cai (mãos puxam a tela)
  var FRAME = [35.3, 36.4];                   // moldura de contato se desenha (aceno)

  /* Deslocamento lateral do filme no desktop (vw) e posição do personagem no celular (fração da largura) */
  var SHIFT = [[0, 22], [15, 22], [20.5, -14], [26.5, -14], [29.5, -4], [30.6, -4], [31.6, -16], [40, -16]];
  var PERSONX = [[0, .5], [19, .5], [19.6, .4], [21, .4], [22, .46], [24.5, .46], [25.3, .52], [26.6, .5], [27.3, .42], [28.4, .29], [30.2, .31], [30.9, .35], [31.2, .5], [40, .5]];

  function kf(arr, t) {
    if (t <= arr[0][0]) return arr[0][1];
    for (var i = 1; i < arr.length; i++) {
      if (t <= arr[i][0]) {
        var a = arr[i - 1], b = arr[i];
        return a[1] + (b[1] - a[1]) * smooth((t - a[0]) / (b[0] - a[0]));
      }
    }
    return arr[arr.length - 1][1];
  }

  /* ================= 2. CONTEÚDO (vem de config.js) ================= */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function setText(id, text) { $(id).textContent = text; }

  document.title = C.name + ' · ' + C.role.split('·')[0].trim();
  setText('ld-name', C.name);
  setText('hint-text', C.ui.hint);

  var brand = $('brand'); brand.textContent = C.name;
  var NAV = [['home', C.nav.home], ['about', C.nav.about], ['work', C.nav.work],
             ['skills', C.nav.skills], ['resume', C.nav.resume], ['contact', C.nav.contact]];
  var navBtns = {};
  NAV.forEach(function (n) {
    var b = el('button', '', n[1]); b.type = 'button'; b.dataset.nav = n[0];
    $('nav').appendChild(b); navBtns[n[0]] = b;
  });

  setText('in-hello', C.hello); setText('in-one', C.lineOne); setText('in-two', C.lineTwo);
  setText('in-role', C.role); setText('in-status', C.status);

  setText('ab-eyebrow', C.about.eyebrow); setText('ab-title', C.about.title); setText('ab-text', C.about.text);
  C.about.stats.forEach(function (s) {
    var d = el('div', 'stat'); d.appendChild(el('b', '', s.value)); d.appendChild(el('span', '', s.label));
    $('ab-stats').appendChild(d);
  });

  setText('wk-eyebrow', C.work.eyebrow); setText('wk-title', C.work.title);
  var cards = C.work.projects.map(function (p) {
    var c = el('article', 'card');
    c.appendChild(el('h3', '', p.title));
    var tg = el('div', 'tags'); p.tags.forEach(function (t) { tg.appendChild(el('span', '', t)); }); c.appendChild(tg);
    c.appendChild(el('p', '', p.desc));
    var a;
    if (p.url) { a = el('a', 'go', C.work.visit); a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; }
    else { a = el('span', 'go off', C.work.soon); }
    c.appendChild(a);
    $('wk-cards').appendChild(c);
    return c;
  });

  setText('sk-eyebrow', C.skills.eyebrow); setText('sk-title', C.skills.title);
  var chips = C.skills.list.map(function (s) { var c = el('span', 'chip', s); $('sk-chips').appendChild(c); return c; });

  setText('rs-eyebrow', C.resume.eyebrow); setText('rs-title', C.resume.title);
  function group(title, items) {
    $('rs-body').appendChild(el('h4', '', title));
    items.forEach(function (it) {
      var d = el('div', 'item');
      d.appendChild(el('b', '', it.role));
      d.appendChild(el('em', '', it.org + (it.period ? ' · ' + it.period : '')));
      if (it.text) d.appendChild(el('span', '', it.text));
      $('rs-body').appendChild(d);
    });
  }
  group(C.resume.experienceTitle, C.resume.experience);
  group(C.resume.educationTitle, C.resume.education);
  var rb = $('rs-btn');
  if (C.resume.file) { rb.textContent = C.resume.buttonDownload; rb.href = C.resume.file; rb.setAttribute('download', ''); }
  else { rb.textContent = C.resume.buttonEmail; rb.href = 'mailto:' + C.contact.email + '?subject=' + encodeURIComponent('Currículo'); }

  setText('ct-eyebrow', C.contact.eyebrow); setText('ct-title', C.contact.title); setText('ct-text', C.contact.text);
  var em = $('ct-email'); em.textContent = C.contact.email; em.href = 'mailto:' + C.contact.email;
  C.contact.links.forEach(function (l) {
    var a = el('a', '', l.label); a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; $('ct-links').appendChild(a);
  });
  setText('ct-city', C.contact.city);

  /* ================= 3. ROLAGEM → TEMPO DO VÍDEO ================= */
  var video = $('film'), wrap = $('film-wrap'), frameRect = document.querySelector('#contact-frame rect');
  var vh = window.innerHeight, sw = window.innerWidth, total = 0, maxScroll = 1;
  var cur = 0, target = 0, ready = false;

  function build() {
    vh = window.innerHeight; sw = window.innerWidth;
    var y = 0;
    SEGS.forEach(function (s) { s.y0 = y; s.len = s.h * vh; y += s.len; });
    total = y + vh;
    $('spacer').style.height = total + 'px';
    maxScroll = Math.max(1, total - vh);
  }
  build();

  var holdP = {};
  function scrollToTime(y) {
    var t = 0;
    for (var i = 0; i < SEGS.length; i++) {
      var s = SEGS[i];
      if (y <= s.y0 + s.len || i === SEGS.length - 1) {
        var local = clamp((y - s.y0) / s.len);
        t = s.t[0] + (s.t[1] - s.t[0]) * local;
        break;
      }
    }
    SEGS.forEach(function (s) { if (s.id) holdP[s.id] = clamp((y - s.y0) / s.len); });
    return t;
  }

  /* ================= 4. LOOP DE RENDER ================= */
  var panels = {};
  ['intro', 'about', 'work', 'skills', 'resume', 'contact'].forEach(function (id) { panels[id] = $('p-' + id); });
  var progressBar = document.querySelector('#progress i'), hint = $('hint');
  var paper = $('rs-paper');
  var isMobile = function () { return sw <= 760; };

  function setPanel(id, op) {
    var p = panels[id];
    op = clamp(op);
    p.style.opacity = op.toFixed(3);
    p.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    p.style.setProperty('--y', ((1 - op) * 18).toFixed(1) + 'px');
    p.classList.toggle('live', op > 0.5);
  }
  function fade(t, win, f) {
    f = f || 0.5;
    return Math.min(clamp((t - win[0]) / f), clamp((win[1] - t) / f));
  }

  var lastNav = '';
  function render() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    target = scrollToTime(y);
    cur += (target - cur) * 0.16;
    if (Math.abs(target - cur) < 0.0015) cur = target;

    var dur = video.duration || 36.75;
    var ct = clamp(cur, 0, dur - 0.04);
    if (ready && Math.abs(ct - video.currentTime) > 0.02 && !video.seeking) {
      try { video.currentTime = ct; } catch (e) {}
    }

    /* posição do filme */
    sw = window.innerWidth; var sh = window.innerHeight, W, H, left, top;
    if (isMobile()) {
      H = sh * 0.9; W = H * 16 / 9; left = sw / 2 - kf(PERSONX, cur) * W; top = sh * 0.07;
    } else {
      W = Math.min(sw, sh * 16 / 9); H = W * 9 / 16;
      left = (sw - W) / 2 + kf(SHIFT, cur) * sw / 100; top = (sh - H) / 2;
    }
    wrap.style.width = W.toFixed(1) + 'px';
    wrap.style.height = H.toFixed(1) + 'px';
    wrap.style.transform = 'translate3d(' + left.toFixed(1) + 'px,' + top.toFixed(1) + 'px,0)';

    /* painéis */
    setPanel('intro', fade(cur, WIN.intro));
    setPanel('about', fade(cur, WIN.about));
    setPanel('work', fade(cur, WIN.work));
    setPanel('skills', fade(cur, WIN.skills));
    setPanel('resume', Math.min(prog(cur, WIN.resume[0], WIN.resume[0] + 0.3), clamp((WIN.resume[1] - cur) / 0.5)));
    setPanel('contact', fade(cur, WIN.contact));

    /* work: cartões voam um a um durante o hold */
    var hp = holdP.work || 0;
    cards.forEach(function (c, i) {
      var p = easeOut(clamp((hp - 0.05 - 0.15 * i) / 0.22));
      c.style.opacity = p.toFixed(3);
      c.style.transform = 'translateX(' + ((1 - p) * 90).toFixed(1) + 'px) rotateY(' + (-(1 - p) * 38).toFixed(1) + 'deg) scale(' + (0.86 + 0.14 * p).toFixed(3) + ')';
    });

    /* skills: chips entram enquanto ele anda */
    chips.forEach(function (c, i) {
      var a = CHIP_START + i * CHIP_STEP, p = easeOut(prog(cur, a, a + 0.45));
      c.style.opacity = p.toFixed(3);
      c.style.transform = 'scale(' + (0.6 + 0.4 * p).toFixed(3) + ')';
      c.style.filter = p >= 1 ? 'none' : 'blur(' + ((1 - p) * 8).toFixed(1) + 'px)';
    });

    /* currículo: cartão de papel cai sincronizado com as mãos */
    var d = easeOut(prog(cur, DROP[0], DROP[1]));
    var dist = isMobile() ? 36 : sh * 0.9;
    paper.style.transform = 'translateY(' + (-(1 - d) * dist).toFixed(1) + 'px)';
    paper.style.opacity = (isMobile() ? d : 1).toFixed(3);

    /* contato: moldura desenhada ao redor dele enquanto acena */
    frameRect.style.strokeDashoffset = (1 - easeOut(prog(cur, FRAME[0], FRAME[1]))).toFixed(4);

    /* barra de progresso, dica e navegação */
    progressBar.style.width = (clamp(y / maxScroll) * 100).toFixed(2) + '%';
    hint.style.opacity = y > 24 || !ready ? 0 : 1;
    var nav = cur < 10.5 ? 'home' : cur < 19 ? 'about' : cur < 26.2 ? 'work' : cur < 31.8 ? 'skills' : cur < 35.2 ? 'resume' : 'contact';
    if (nav !== lastNav) {
      if (lastNav) navBtns[lastNav].classList.remove('on');
      navBtns[nav].classList.add('on'); lastNav = nav;
    }
    requestAnimationFrame(render);
  }

  /* navegação suave até cada hold */
  function goTo(id) {
    var y = 0;
    if (id !== 'home') {
      var s = SEGS.filter(function (x) { return x.id === id; })[0];
      y = s.y0 + s.len * (id === 'work' ? 0.62 : 0.5);
    }
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-nav]');
    if (!b) return;
    e.preventDefault(); goTo(b.dataset.nav);
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var frac = clamp((window.scrollY || 0) / maxScroll);
      build(); window.scrollTo(0, frac * maxScroll);
    }, 120);
  });

  /* iOS: precisa de play()+pause() no primeiro toque para permitir seek */
  function unlock() {
    var p = video.play();
    if (p && p.then) p.then(function () { video.pause(); }).catch(function () {});
    else video.pause();
    window.removeEventListener('touchstart', unlock);
  }
  window.addEventListener('touchstart', unlock, { passive: true });

  /* ================= 5. CARREGAR O FILME INTEIRO (fetch + progresso) ================= */
  var fill = $('ld-fill'), pct = $('ld-pct');
  function showProgress(f) {
    fill.style.width = (f * 100).toFixed(1) + '%';
    pct.textContent = Math.round(f * 100) + '%';
  }
  function finish() {
    ready = true;
    showProgress(1);
    $('loader').classList.add('done');
    try { video.pause(); video.currentTime = 0; } catch (e) {}
  }

  var url = isMobile() ? 'media/film_mobile.mp4' : 'media/film.mp4';
  video.poster = 'media/poster.jpg';
  video.addEventListener('error', function () { if (!ready) finish(); });

  function useSrc(src) {
    var done = false;
    function ok() { if (!done) { done = true; finish(); } }
    video.addEventListener('loadeddata', ok, { once: true });
    video.src = src; video.load();
    setTimeout(ok, 9000);
  }

  function loadFilm() {
    if (!window.fetch || !window.ReadableStream) { useSrc(url); return; }
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var len = +res.headers.get('Content-Length') || 0, got = 0, chunks = [];
      var type = res.headers.get('Content-Type') || 'video/mp4';
      var reader = res.body.getReader();
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: type });
          chunks.push(r.value); got += r.value.length;
          showProgress(len ? Math.min(got / len, 0.98) : Math.min(got / 8e6, 0.98));
          return pump();
        });
      })();
    }).then(function (blob) {
      useSrc(URL.createObjectURL(blob));
    }).catch(function () { useSrc(url); });  // plano B: src simples
  }

  loadFilm();
  requestAnimationFrame(render);
})();
