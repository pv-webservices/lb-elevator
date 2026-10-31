const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/* ---------- Header & navigation ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('.primary-nav');

function closeMenus() {
  document.querySelectorAll('.has-dropdown.open').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
}
function setMenu(open: boolean) {
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('is-open', open);
  header?.classList.toggle('menu-open', open);
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (!open) closeMenus();
}
menuButton?.addEventListener('click', () =>
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true'),
);
nav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) setMenu(false);
  }),
);
matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});
document.querySelectorAll<HTMLButtonElement>('.dropdown-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    closeMenus();
    button.setAttribute('aria-expanded', String(open));
    button.closest('li')?.classList.toggle('open', open);
  });
});
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.has-dropdown')) closeMenus();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const expanded = document.querySelector<HTMLButtonElement>(
    '.dropdown-toggle[aria-expanded="true"]',
  );
  closeMenus();
  if (expanded) expanded.focus();
  else if (menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

/* ---------- Word-by-word statement ---------- */
const wordBlocks = Array.from(document.querySelectorAll<HTMLElement>('[data-words]'));
wordBlocks.forEach((block) => {
  if (reduceMotion) return;
  const words = (block.textContent || '').trim().split(/\s+/);
  block.setAttribute('aria-label', words.join(' '));
  block.innerHTML = words
    .map((w) => `<span class="w" aria-hidden="true">${w.replace(/</g, '&lt;')}</span>`)
    .join(' ');
});

/* ---------- Scroll engine ----------
   Exposes --p (0→1 while an element crosses the viewport), --pin (0→1 while a
   tall section scrolls past a full-height sticky child) and --mid (0→1 as the
   element passes the viewport centre). Only transform/opacity read them. */
const progressEls = Array.from(document.querySelectorAll<HTMLElement>('[data-progress]'));
const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax], .media-frame'));
const shaft = document.querySelector<HTMLElement>('.shaft');
const stackCards = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-card]'));
const stackLinks = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-link]'));
const hscroll = document.querySelector<HTMLElement>('[data-hscroll]');
const hTrack = hscroll?.querySelector<HTMLElement>('[data-hscroll-track]');
const floorTrack = document.querySelector<HTMLElement>('[data-floor-progress]');
const hPin = matchMedia('(min-width: 901px)');
let hDistance = 0;
const geometryEls = [...new Set([
  ...progressEls, ...parallaxEls, ...wordBlocks, ...stackCards,
  ...(shaft ? [shaft] : []), ...(hscroll ? [hscroll] : []),
])];

function layoutHScroll() {
  if (!hscroll || !hTrack) return;
  if (reduceMotion || !hPin.matches) {
    hscroll.style.height = '';
    hTrack.style.transform = '';
    delete hscroll.dataset.ready;
    hDistance = 0;
    return;
  }
  const viewport = hTrack.parentElement as HTMLElement;
  hDistance = Math.max(0, hTrack.scrollWidth - viewport.clientWidth);
  hscroll.style.height = `${window.innerHeight + hDistance}px`;
  hscroll.dataset.ready = '';
}

function update() {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - vh;
  // Read geometry together before style writes to avoid repeated forced layouts.
  const rects = new Map<HTMLElement, DOMRect>();
  if (!reduceMotion) geometryEls.forEach(el => rects.set(el, el.getBoundingClientRect()));
  header?.classList.toggle('is-solid', y > 40);
  if (floorTrack) {
    floorTrack.style.setProperty('--page', String(max > 0 ? clamp(y / max) : 0));
  }
  if (reduceMotion) return;

  for (const el of progressEls) {
    const r = rects.get(el)!;
    if (r.bottom < -vh || r.top > vh * 2) continue;
    el.style.setProperty('--p', (clamp((vh - r.top) / (vh + r.height))).toFixed(4));
    // Pinned sections run over their extra height; viewport-high ones over their own height.
    const span = r.height - vh > vh * 0.3 ? r.height - vh : r.height;
    el.style.setProperty('--pin', clamp(-r.top / span).toFixed(4));
  }
  for (const el of parallaxEls) {
    const r = rects.get(el)!;
    if (r.bottom < 0 || r.top > vh) continue;
    el.style.setProperty('--py', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
  }
  if (shaft) {
    const r = rects.get(shaft)!;
    shaft.style.setProperty('--mid', clamp((vh * 0.55 - r.top) / r.height).toFixed(4));
  }
  wordBlocks.forEach((block) => {
    const r = rects.get(block)!;
    const words = block.querySelectorAll('.w');
    const t = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    const lit = Math.round(t * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  });
  if (hscroll && hTrack && hDistance) {
    const r = rects.get(hscroll)!;
    const t = clamp(-r.top / hDistance);
    hTrack.style.transform = `translate3d(${-t * hDistance}px,0,0)`;
    hscroll.style.setProperty('--pin', t.toFixed(4));
  }
  let active = 0;
  stackCards.forEach((card, i) => {
    const next = stackCards[i + 1];
    const r = rects.get(card)!;
    if (r.top < vh * 0.5) active = i;
    if (!next) return;
    const gap = rects.get(next)!.top - r.top;
    card.style.setProperty('--cover', clamp(1 - gap / r.height).toFixed(4));
  });
  stackLinks.forEach((link, i) => link.classList.toggle('active', i === active));
}

let ticking = false;
function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    update();
  });
}
layoutHScroll();
update();
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => {
  layoutHScroll();
  requestUpdate();
});
window.addEventListener('load', () => {
  layoutHScroll();
  requestUpdate();
});

/* ---------- Floor indicator ---------- */
const floors = Array.from(document.querySelectorAll<HTMLElement>('[data-floor]'));
const floorNumber = document.querySelector('[data-floor-number]');
const floorLabel = document.querySelector('[data-floor-label]');
const floorIndicator = document.querySelector('.floor-indicator');
let currentFloor = 0;
if (floors.length < 3) floorIndicator?.remove();
else if ('IntersectionObserver' in window) {
  const floorObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = floors.indexOf(entry.target as HTMLElement);
        floorIndicator?.classList.toggle('down', index < currentFloor);
        currentFloor = index;
        if (floorNumber) floorNumber.textContent = index === 0 ? 'G' : String(index).padStart(2, '0');
        if (floorLabel) floorLabel.textContent = (entry.target as HTMLElement).dataset.floor || '';
      }),
    { rootMargin: '-50% 0px -50% 0px' },
  );
  floors.forEach((f) => floorObserver.observe(f));
  const footer = document.querySelector('.site-footer');
  if (footer)
    new IntersectionObserver(([entry]) =>
      floorIndicator?.classList.toggle('is-away', entry.isIntersecting),
    ).observe(footer);
}

/* ---------- Reveal on scroll ---------- */
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

/* ---------- Video clips ---------- */
// Clips play muted only while visible. With reduced motion they stay paused
// on their poster and offer native controls instead.
const clips = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  clips.forEach((clip) => {
    clip.controls = true;
  });
} else {
  const clipObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        const clip = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) clip.play().catch(() => (clip.controls = true));
        else clip.pause();
      }),
    { threshold: 0.25 },
  );
  clips.forEach((clip) => clipObserver.observe(clip));
}

/* ---------- Door selector ---------- */
interface Door {
  name: string;
  image: string;
  description: string;
}
const doorSelector = document.querySelector<HTMLElement>('[data-door-selector]');
const doorDataEl = document.getElementById('door-data');
if (doorSelector && doorDataEl) {
  const doorList = JSON.parse(doorDataEl.textContent || '[]') as Door[];
  const stage = doorSelector.querySelector<HTMLElement>('.door-stage')!;
  const tabs = Array.from(doorSelector.querySelectorAll<HTMLButtonElement>('[data-door]'));
  const img = stage.querySelector<HTMLImageElement>('[data-door-image]')!;
  let swapTimer = 0;
  const show = (index: number) => {
    const door = doorList[index];
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index));
      t.tabIndex = i === index ? 0 : -1;
    });
    stage.setAttribute('aria-labelledby', tabs[index].id);
    const apply = () => {
      img.removeAttribute('srcset');
      img.src = `/images/catalogue/${door.image}-2x.webp`;
      img.alt = `${door.name} — brochure illustration`;
      stage.querySelector('[data-door-name]')!.textContent = door.name;
      stage.querySelector('[data-door-text]')!.textContent = door.description;
      stage.querySelector('[data-door-count]')!.textContent =
        `${String(index + 1).padStart(2, '0')} / ${String(doorList.length).padStart(2, '0')}`;
      stage.querySelector<HTMLAnchorElement>('[data-door-link]')!.href =
        `/contact-us/?door=${encodeURIComponent(door.name)}#enquiry`;
    };
    window.clearTimeout(swapTimer);
    if (reduceMotion) return apply();
    stage.classList.add('closing');
    swapTimer = window.setTimeout(() => {
      apply();
      stage.classList.remove('closing');
    }, 560);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', (e) => {
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const next = (i + keys[e.key] + tabs.length) % tabs.length;
      tabs[next].focus();
      show(next);
    });
  });
}

import './forms';

/* ---------- Gallery filter & lightbox ---------- */
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('[data-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll<HTMLElement>('[data-category]').forEach((item) => {
      item.hidden =
        button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter;
    });
    const count = document.querySelector('[data-gallery-count]');
    if (count)
      count.textContent = `${document.querySelectorAll('[data-category]:not([hidden])').length} visuals`;
  });
});
const lightbox = document.querySelector<HTMLDialogElement>('.lightbox');
let galleryOpener: HTMLButtonElement | undefined;
document.querySelectorAll<HTMLButtonElement>('[data-lightbox]').forEach((button) =>
  button.addEventListener('click', () => {
    if (!lightbox) return;
    const image = button.querySelector('img')!;
    const target = lightbox.querySelector('img')!;
    target.removeAttribute('srcset');
    target.src = button.dataset.full || image.src;
    target.alt = image.alt;
    lightbox.querySelector('.lightbox-caption')!.textContent = image.alt;
    galleryOpener = button;
    lightbox.showModal();
  }),
);
lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => galleryOpener?.focus());

/* Maps load only after a visitor requests one. */
document.querySelectorAll<HTMLButtonElement>('[data-load-map]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = button.dataset.loadMap!;
    frame.title = button.dataset.mapTitle!;
    frame.referrerPolicy = 'no-referrer';
    frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
    button.parentElement!.replaceChildren(frame);
  });
});
