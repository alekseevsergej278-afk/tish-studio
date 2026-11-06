const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const header = document.querySelector('[data-header]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Открыть меню' : 'Закрыть меню';
  navigation.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = 'Открыть меню';
}));

const progress = document.querySelector('[data-progress]');
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;
const syncScroll = () => {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${range > 0 ? (window.scrollY / range) * 100 : 0}%`;
  header?.classList.toggle('is-scrolled', window.scrollY > 48);
  if (!reduceMotion) {
    parallaxItems.forEach((item) => {
      const rect = item.parentElement.getBoundingClientRect();
      const speed = Number(item.dataset.parallax || 0);
      item.style.transform = `translate3d(0, ${(window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed}px, 0)`;
    });
  }
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(syncScroll); ticking = true; }
}, { passive: true });
syncScroll();

const reveals = document.querySelectorAll('.reveal');
if (reduceMotion) reveals.forEach((element) => element.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((element) => observer.observe(element));
}

if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${(event.clientY - rect.top - rect.height / 2) * 0.14}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

const form = document.querySelector('.contact-form');
const fields = [['name', 'Пожалуйста, представьтесь.'], ['contact-detail', 'Укажите почту или телефон.'], ['brief', 'Опишите участок или задачу в двух словах.']];
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;
  fields.forEach(([id, message]) => {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id === 'contact-detail' ? 'contact' : id}-error`);
    const empty = !input.value.trim();
    input.setAttribute('aria-invalid', String(empty));
    error.textContent = empty ? message : '';
    valid &&= !empty;
  });
  const status = form.querySelector('.form-status');
  if (valid) status.textContent = 'Спасибо. В демонстрационной версии форма не отправляет данные — подключите почту или CRM перед запуском в работу.';
  else { status.textContent = 'Проверьте отмеченные поля.'; form.querySelector('[aria-invalid="true"]')?.focus(); }
});

