(function () {
  'use strict';

  // ── Guard against double-injection ──────────────────────────
  if (document.getElementById('navbar')) return;

  // ── Inject shared CSS ────────────────────────────────────────
  var style = document.createElement('style');
  style.id = 'nav-component-styles';
  style.textContent = `
    /* ── ANNOUNCEMENT BAR ─────────────────────────────────── */
    .announcement-bar {
      background: var(--black);
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      font-size: 13px;
      font-weight: 300;
      letter-spacing: 0.01em;
      padding: 10px 20px;
      line-height: 1.4;
    }
    .announcement-bar a {
      color: var(--p300);
      text-decoration: underline;
      text-decoration-color: transparent;
      transition: text-decoration-color 0.2s ease;
    }
    .announcement-bar a:hover {
      text-decoration-color: var(--p300);
    }

    /* ── NAV ──────────────────────────────────────────────── */
    nav#navbar {
      position: sticky;
      top: 0;
      z-index: 200;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      transition: box-shadow 0.3s ease;
    }
    nav#navbar.scrolled {
      box-shadow: 0 2px 20px rgba(16, 15, 18, 0.08);
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
      height: 60px;
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 500;
      color: var(--black);
      text-decoration: none;
      letter-spacing: -0.01em;
      flex-shrink: 0;
    }
    .nav-logo-mark {
      width: 28px;
      height: 28px;
      background-image: url('./Assets/Hero/hero-new.jpeg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      display: grid;
      place-items: center;
      transition: transform 0.3s var(--ease-spring, cubic-bezier(0.175, 0.885, 0.32, 1.275));
    }
    .nav-logo-mark svg { display: block; color: white; }
    @keyframes nav-logoWiggle {
      0%   { transform: scale(1) rotate(0deg); }
      25%  { transform: scale(1.1) rotate(-10deg); }
      75%  { transform: scale(1.1) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    .nav-logo:hover .nav-logo-mark {
      animation: nav-logoWiggle 0.5s var(--ease-spring, cubic-bezier(0.175, 0.885, 0.32, 1.275)) forwards;
    }
    .nav-logo:focus-visible {
      outline: 2px solid var(--p500);
      outline-offset: 3px;
      border-radius: 4px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2px;
      list-style: none;
      flex: 1;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      font-size: 14px;
      font-weight: 400;
      color: var(--n700);
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s ease, background 0.2s ease;
    }
    .nav-links a:hover {
      color: var(--black);
      background: rgba(16, 15, 18, 0.05);
    }
    .nav-links a.active {
      color: var(--black);
      font-weight: 500;
    }
    .nav-links a:focus-visible {
      outline: 2px solid var(--p500);
      outline-offset: 2px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    /* btn base — only if not already defined by host page */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 100px;
      cursor: pointer;
      border: none;
      transition: transform 0.2s var(--ease-spring, cubic-bezier(0.175, 0.885, 0.32, 1.275)), box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    .btn:active { transform: scale(0.97) !important; }
    .btn:focus-visible { outline: 2px solid var(--p500); outline-offset: 3px; }
    .btn-ghost {
      padding: 8px 18px;
      color: var(--n700);
      background: transparent;
    }
    .btn-ghost:hover {
      color: var(--black);
      background: rgba(16, 15, 18, 0.05);
    }
    /* Shared nav primary button (works on all pages) */
    .btn-nav-primary {
      padding: 9px 20px;
      color: #fff;
      background: var(--black);
      box-shadow: 0 1px 4px rgba(16, 15, 18, 0.2);
      border-radius: 100px;
    }
    .btn-nav-primary:hover {
      background: var(--p900);
      box-shadow: 0 4px 16px rgba(46, 31, 107, 0.3);
      transform: translateY(-1px);
    }

    /* ── MOBILE NAV ───────────────────────────────────────── */
    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 16px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      z-index: 2000;
    }
    .mobile-toggle span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: var(--black);
      border-radius: 2px;
      transition: all 0.3s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
    }
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      z-index: 1500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
    }
    .mobile-overlay-links {
      list-style: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin: 0;
      padding: 0;
    }
    .mobile-overlay-links a {
      font-size: 32px;
      font-weight: 500;
      color: var(--black);
      text-decoration: none;
      font-family: 'DM Serif Display', serif;
    }
    .nav-menu-open .mobile-overlay { opacity: 1; pointer-events: auto; }
    .nav-menu-open .mobile-toggle span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-menu-open .mobile-toggle span:nth-child(2) { opacity: 0; }
    .nav-menu-open .mobile-toggle span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .nav-menu-open { overflow: hidden; }
    @media (max-width: 500px) {
      .nav-links, .nav-actions { display: none !important; }
      .mobile-toggle { display: flex; margin-left: auto; }
    }

    /* ── THEME TOGGLE ─────────────────────────────────────── */
    .btn-theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1.5px solid rgba(16, 15, 18, 0.15);
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--n700);
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s var(--ease-spring, cubic-bezier(0.175, 0.885, 0.32, 1.275));
      flex-shrink: 0;
    }
    .btn-theme-toggle:hover {
      background: rgba(16, 15, 18, 0.06);
      border-color: rgba(16, 15, 18, 0.25);
      color: var(--black);
      transform: scale(1.08);
    }
    .btn-theme-toggle:active { transform: scale(0.95); }
    .btn-theme-toggle:focus-visible { outline: 2px solid var(--p500); outline-offset: 3px; }
    .icon-sun { display: none; }
    .icon-moon { display: block; }
    [data-theme="dark"] .icon-sun { display: block; }
    [data-theme="dark"] .icon-moon { display: none; }

    /* ── DARK MODE: nav ───────────────────────────────────── */
    [data-theme="dark"] .announcement-bar {
      background: #09090b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    [data-theme="dark"] nav#navbar {
      background: rgba(9, 9, 11, 0.88);
      border-bottom-color: rgba(255, 255, 255, 0.07);
    }
    [data-theme="dark"] nav#navbar.scrolled {
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
    }
    [data-theme="dark"] .nav-logo { color: rgba(255, 255, 255, 0.9); }
    [data-theme="dark"] .nav-links a { color: rgba(255, 255, 255, 0.65); }
    [data-theme="dark"] .nav-links a:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
    [data-theme="dark"] .nav-links a.active { color: #fff; }
    [data-theme="dark"] .btn-ghost { color: rgba(255, 255, 255, 0.75); }
    [data-theme="dark"] .btn-ghost:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
    [data-theme="dark"] .btn-nav-primary {
      background: var(--p700, #b49ef5);
      color: #fff;
    }
    [data-theme="dark"] .btn-nav-primary:hover {
      background: #c5b0ff;
      color: #1a1020;
    }
    [data-theme="dark"] .mobile-overlay { background: rgba(9, 9, 11, 0.92); }
    [data-theme="dark"] .btn-theme-toggle {
      border-color: rgba(255, 255, 255, 0.15);
      color: var(--n700);
    }
    [data-theme="dark"] .btn-theme-toggle:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
      color: var(--black);
    }
  `;
  document.head.appendChild(style);

  // ── Determine active page ────────────────────────────────────
  var path = window.location.pathname.replace(/\/$/, '');
  var page = path.split('/').pop() || 'index.html';

  function isActive(href) {
    // Match filename portion of href to current page
    var hrefPage = href.split('/').pop().split('#')[0] || 'index.html';
    return hrefPage === page || (page === '' && hrefPage === 'index.html');
  }

  function navLink(href, label, target) {
    var active = isActive(href) ? ' class="active"' : '';
    var targetAttr = target ? ' target="' + target + '"' : '';
    return '<li><a href="' + href + '"' + active + targetAttr + '>' + label + '</a></li>';
  }

  // ── Build HTML ───────────────────────────────────────────────
  var logoSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 2.67-2.1 2.67-2.1.5 1.28.17 2.22.08 2.45.6.65.92 1.51.92 2.39 0 3.11-1.9 3.8-3.71 4 .29.25.54.73.54 1.48V17c0 .3 0 .6.17.9"/><path d="M12 5c-.67 0-1.35.09-2 .26-1.78-2-2.67-2.1-2.67-2.1-.5 1.28-.17 2.22-.08 2.45-.6.65-.92 1.51-.92 2.39 0 3.11 1.9 3.8 3.71 4a2.39 2.39 0 0 0-.54 1.48V17c0 .3 0 .6-.17.9"/><path d="M9 13c0-1.5 1-2.5 3-2.5s3 1 3 2.5"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/></svg>';

  var moonSVG = '<svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var sunSVG = '<svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  var announcementHTML =
    '<div class="announcement-bar" role="banner">' +
      'Available for new opportunities &middot; <a href="https://www.linkedin.com/in/unnati-srivastava/">Let\'s talk</a>' +
    '</div>';

  var navHTML =
    '<nav id="navbar" aria-label="Main navigation">' +
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-logo" aria-label="Home — Unnati">' +
          '<span class="nav-logo-mark" aria-hidden="true">' + logoSVG + '</span>' +
          'Unnati' +
        '</a>' +
        '<ul class="nav-links" role="list">' +
          navLink('index.html#work-grid', 'Work') +
          navLink('about.html', 'About') +
          navLink('Assets/About%20me/resume.pdf', 'Resume', '_blank') +
        '</ul>' +
        '<div class="nav-actions">' +
          '<button id="themeToggle" class="btn-theme-toggle" aria-label="Toggle dark mode">' +
            moonSVG + sunSVG +
          '</button>' +
          '<a href="https://www.linkedin.com/in/unnati-srivastava/" class="btn btn-ghost">Say hello</a>' +
          '<a href="index.html#work-grid" class="btn btn-nav-primary">View work</a>' +
        '</div>' +
        '<button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</nav>' +
    '<div class="mobile-overlay" id="mobileOverlay">' +
      '<ul class="mobile-overlay-links">' +
        '<li><a href="index.html#work-grid">Work</a></li>' +
        '<li><a href="about.html">About</a></li>' +
        '<li><a href="Assets/About%20me/resume.pdf" target="_blank">Resume</a></li>' +
        '<li><a href="https://www.linkedin.com/in/unnati-srivastava/">Contact</a></li>' +
      '</ul>' +
    '</div>';

  // ── Inject into DOM ──────────────────────────────────────────
  var container = document.createElement('div');
  container.innerHTML = announcementHTML + navHTML;
  // Insert at top of body
  document.body.insertBefore(container.firstChild, document.body.firstChild); // announcement bar
  document.body.insertBefore(container.firstChild, document.body.children[1]); // nav
  document.body.insertBefore(container.firstChild, document.body.children[2]); // mobile overlay

  // ── Behaviour ────────────────────────────────────────────────
  // Scroll shadow
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  var mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-menu-open');
    });
  }
  document.querySelectorAll('.mobile-overlay-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('nav-menu-open');
    });
  });

  // Theme toggle
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();
