// GenAlpha Labs — interactions
document.body.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// nav scrolled + fab
const nav = document.getElementById('nav');
const fab = document.querySelector('.fab');
const onScroll = () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  if (fab) {
    const c = document.getElementById('contact');
    const nearEnd = c && c.getBoundingClientRect().top < innerHeight * 0.85;
    fab.classList.toggle('show', scrollY > 700 && !nearEnd);
  }
  const h = document.documentElement;
  document.getElementById('scrollBar').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100).toFixed(2) + '%';
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
}));

// reveal
const els = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  els.forEach(e => e.classList.add('in'));
} else {
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(e => io.observe(e));
}

// year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- lead form: "Request a proposal" sends the details on WhatsApp ----------
const form = document.getElementById('leadForm');
const statusEl = document.getElementById('formStatus');
const WA_NUMBER = '918169102798';

function enquiryText() {
  const d = new FormData(form);
  const interests = d.getAll('interest').join(', ') || '-';
  return `Hi GenAlpha Labs, I'd like a robotics lab proposal.\n\n` +
    `Name: ${d.get('name') || '-'}\nInstitution: ${d.get('institution') || '-'}\nDesignation: ${d.get('designation') || '-'}\n` +
    `Phone: ${d.get('phone') || '-'}\nEmail: ${d.get('email') || '-'}\nCity: ${d.get('city') || '-'}\n` +
    `Lab size: ${d.get('lab_size') || '-'}\nLooking for: ${interests}`;
}
function setStatus(msg, cls) { statusEl.textContent = msg; statusEl.className = 'form-status ' + (cls || ''); }

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim(), phone = form.phone.value.trim();
  if (!name || !phone) { setStatus('Please enter your name and phone number.', 'err'); (name ? form.phone : form.name).focus(); return; }
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(enquiryText())}`;
  setStatus('Opening WhatsApp… press send to submit your request.', 'ok');
  // same-tab navigation is the most reliable way to hand off to the WhatsApp app on phones
  window.location.href = url;
});

// ---------- lightbox for project photos ----------
(() => {
  const lb = document.getElementById('lightbox'); if (!lb) return;
  const img = document.getElementById('lbImg'), cap = document.getElementById('lbCap'), stage = document.getElementById('lbStage');
  const items = [...document.querySelectorAll('.proj')].map(f => ({
    src: f.querySelector('img').src, alt: f.querySelector('img').alt,
    cap: f.querySelector('figcaption') ? f.querySelector('figcaption').innerHTML : ''
  }));
  let idx = 0, zoomed = false, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src; img.alt = items[idx].alt; cap.innerHTML = items[idx].cap;
    unzoom();
  }
  function unzoom() { zoomed = false; img.classList.remove('zoomed'); img.style.transformOrigin = '50% 50%'; stage.scrollTo(0, 0); }
  function open(i) {
    lastFocus = document.activeElement; show(i);
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; document.getElementById('lbClose').focus();
  }
  function close() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; unzoom(); if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.proj').forEach((f, i) => {
    f.addEventListener('click', () => open(i));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target === stage) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
  });

  // tap / click on the photo toggles 2.5x zoom around the tapped point
  img.addEventListener('click', e => {
    e.stopPropagation();
    if (zoomed) { unzoom(); return; }
    const r = img.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`;
    zoomed = true; img.classList.add('zoomed');
  });

  // swipe left/right for prev/next (only when not zoomed)
  let sx = 0, sy = 0;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (zoomed) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(dx < 0 ? idx + 1 : idx - 1);
  }, { passive: true });
})();
