/* ─────────────────────────────────────────────
   DATA is in script/projects-data.js
   CONFIG
──────────────────────────────────────────────── */
const PER_PAGE = 6;

/* ─── STATE ─── */
let shown = 0;

/* ─── SCROLL PROGRESS BAR ─── */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ─── NAV SCROLL ─── */
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('s', scrollY > 60)
);

gsap.registerPlugin(ScrollTrigger);

/* ─── INIT ─── */
window.addEventListener('DOMContentLoaded', () => {
  // Total count in header
  const countEl = document.getElementById('pgTotalCount');
  if (countEl) countEl.textContent = `${PROJECTS.length} Projects`;

  renderCards(PER_PAGE);
});

/* ─────────────────────────────────────────────
   CARD RENDERING
──────────────────────────────────────────────── */
function renderCards(count) {
  const grid = document.getElementById('pgGrid');
  const end = Math.min(shown + count, PROJECTS.length);
  const newCards = [];

  for (let i = shown; i < end; i++) {
    const card = buildCard(PROJECTS[i], i);
    grid.appendChild(card);
    newCards.push(card);
  }

  shown = end;

  // Staggered entrance
  newCards.forEach((card, idx) => {
    setTimeout(() => {
      card.style.transition = `opacity .55s cubic-bezier(.16,1,.3,1) ${idx * 55}ms, transform .55s cubic-bezier(.16,1,.3,1) ${idx * 55}ms`;
      card.classList.add('visible');
    }, 30);
  });

  updateLoadBtn();
}

function buildCard(p, idx) {
  const card = document.createElement('div');
  card.className = 'pg-card';
  card.setAttribute('data-id', p.id);

  const mediaEl = p.image
    ? `<img class="pg-card-img" src="${p.image}" alt="${p.title}" loading="lazy">`
    : `<div class="pg-card-placeholder"><span class="pg-card-placeholder-ico">${p.title.charAt(0)}</span></div>`;

  const stackTags = (p.stack || []).slice(0, 3)
    .map(t => `<span class="pg-stack-tag">${t}</span>`).join('');

  card.innerHTML = `
    ${mediaEl}
    <span class="pg-card-num">${String(idx + 1).padStart(2, '0')}</span>
    ${p.type ? `<span class="pg-card-type">${p.type}</span>` : ''}
    <div class="pg-card-hover">
      <div class="pg-card-title">${p.title}</div>
      ${p.stack?.length ? `<div class="pg-card-stack">${stackTags}</div>` : ''}
      <div class="pg-card-cta">
        View Project
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  `;

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View project: ${p.title}`);
  card.addEventListener('click', () => navigateToProject(p.id));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToProject(p.id);
    }
  });
  return card;
}

/* ─── LOAD MORE + PROGRESS ─── */
function updateLoadBtn() {
  const wrap     = document.getElementById('pgLoadWrap');
  const bar      = document.getElementById('pgProgressBar');
  const label    = document.getElementById('pgProgressLabel');
  const pct      = Math.round((shown / PROJECTS.length) * 100);

  // Update progress bar
  if (bar)   bar.style.width = pct + '%';
  if (label) label.textContent = `${shown} of ${PROJECTS.length}`;

  // Hide button when all shown
  if (shown >= PROJECTS.length) {
    document.getElementById('pgLoadBtn').style.display = 'none';
  }
}

document.getElementById('pgLoadBtn').addEventListener('click', () => {
  const btn = document.getElementById('pgLoadBtn');
  btn.style.transform = 'scale(.97)';
  setTimeout(() => btn.style.transform = '', 180);
  renderCards(PER_PAGE);
});

/* ─────────────────────────────────────────────
   PAGE TRANSITION handled by transition.js
   ptNavigate() is available globally
──────────────────────────────────────────────── */
function navigateToProject(id) {
  window.ptNavigate(`project-detail.html?id=${id}`);
}
