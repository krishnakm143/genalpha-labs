// GenAlpha Labs — interactions
document.body.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// nav scrolled + fab
const nav = document.getElementById('nav');
const fab = document.querySelector('.fab');
const onScroll = () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  if (fab) fab.classList.toggle('show', scrollY > 700);
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

// lead form (Formspree + mailto fallback)
const form = document.getElementById('leadForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const CONFIGURED = !form.action.includes('YOUR_FORM_ID');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const interests = data.getAll('interest').join(', ') || '-';

  if (!CONFIGURED) {
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nInstitution: ${data.get('institution') || '-'}\nDesignation: ${data.get('designation') || '-'}\n` +
      `Phone: ${data.get('phone')}\nEmail: ${data.get('email') || '-'}\nCity: ${data.get('city') || '-'}\n` +
      `Lab size: ${data.get('lab_size') || '-'}\nLooking for: ${interests}`
    );
    window.location.href = `mailto:info@genalphalabs.com?subject=${encodeURIComponent('Robotics Lab Proposal — ' + (data.get('name') || 'Enquiry'))}&body=${body}`;
    statusEl.textContent = 'Opening your email app to send the enquiry…';
    statusEl.className = 'form-status ok';
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = 'Sending…'; statusEl.className = 'form-status';
  try {
    const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (res.ok) { form.reset(); statusEl.textContent = 'Thank you! We\'ll get back to you with a proposal soon.'; statusEl.className = 'form-status ok'; }
    else throw new Error();
  } catch { statusEl.textContent = 'Could not send right now — please call or email us directly.'; statusEl.className = 'form-status err'; }
  finally { submitBtn.disabled = false; }
});
