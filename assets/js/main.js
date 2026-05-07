(function () {
  'use strict';

  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');
  var progress = document.querySelector('.scroll-progress');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  function updateProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var value = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progress.style.setProperty('--scroll-progress', value.toFixed(2) + '%');
  }

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if (navPanel) {
    navPanel.addEventListener('click', function (event) {
      if (event.target && event.target.matches('a')) closeMenu();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  function updateActiveSection() {
    var current = sections[0] ? sections[0].id : '';
    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.35) current = section.id;
    });
    if (current) setActiveNav(current);
  }

  function onScroll() {
    updateHeader();
    updateProgress();
    updateActiveSection();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress);
  onScroll();

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  function animateCounter(element) {
    if (element.dataset.done === 'true') return;
    element.dataset.done = 'true';

    var to = parseInt(element.getAttribute('data-to') || '0', 10);
    var prefix = element.getAttribute('data-prefix') || '';
    var suffix = element.getAttribute('data-suffix') || '';
    var duration = 1250;
    var start = performance.now();

    function frame(now) {
      var progressValue = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - progressValue, 3);
      var value = Math.round(to * eased);
      element.textContent = prefix + value + suffix;
      if (progressValue < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-counter]'));
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    counters.forEach(function (counter) { counterObserver.observe(counter); });
  } else {
    counters.forEach(animateCounter);
  }

  var videos = Array.prototype.slice.call(document.querySelectorAll('video'));
  videos.forEach(function (video) {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  });
})();
