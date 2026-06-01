/* ═══════════════════════════════════════════════
   PAGE TRANSITION  —  shared across all pages
   ═══════════════════════════════════════════════
   Automatically intercepts all internal <a> links
   and wraps navigation with a slide animation.

   Usage: include this script on every page,
   BEFORE any page-specific scripts.
   No configuration needed.
═══════════════════════════════════════════════ */

(function () {

  /* ── Create overlay element ── */
  const overlay = document.createElement('div');
  overlay.className = 'pt-overlay';
  overlay.id = 'ptOverlay';
  document.body.appendChild(overlay);

  /* ── On page load: play enter animation (overlay exits upward) ── */
  window.addEventListener('DOMContentLoaded', () => {
    // Small delay so browser has painted the page first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('pt-in');
        overlay.addEventListener('animationend', () => {
          overlay.classList.remove('pt-in');
          overlay.style.transform = 'translateY(100%)';
        }, { once: true });
      });
    });
  });

  /* ── Navigate with transition ── */
  function navigateTo(href) {
    // Already animating — ignore
    if (overlay.classList.contains('pt-out')) return;

    overlay.style.transform = ''; // reset
    overlay.classList.add('pt-out');

    overlay.addEventListener('animationend', () => {
      window.location.href = href;
    }, { once: true });
  }

  /* ── Intercept all internal links ── */
  function isInternal(a) {
    if (!a || a.tagName !== 'A') return false;
    const href = a.getAttribute('href');
    if (!href) return false;
    // Skip: external, blank target, anchors only, mailto, tel, download
    if (a.target === '_blank') return false;
    if (a.hasAttribute('download')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    // Pure anchor — same-page scroll, skip
    if (href.startsWith('#')) return false;
    // External URL
    try {
      const url = new URL(href, window.location.href);
      if (url.hostname !== window.location.hostname) return false;
      // Same page with anchor (e.g. index.html#about from projects.html) — allow transition
      return true;
    } catch {
      return false;
    }
  }

  document.addEventListener('click', (e) => {
    // Walk up DOM tree in case click was on child element of <a>
    let target = e.target;
    while (target && target !== document) {
      if (target.tagName === 'A' && isInternal(target)) {
        e.preventDefault();
        navigateTo(target.href);
        return;
      }
      target = target.parentElement;
    }
  });

  /* ── Programmatic navigation helper (used by projects.js) ── */
  window.ptNavigate = navigateTo;

})();
