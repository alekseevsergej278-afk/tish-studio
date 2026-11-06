const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Открыть меню' : 'Закрыть меню';
  navigation.classList.toggle('open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (window.innerWidth <= 760) {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    const menuLabel = menuButton?.querySelector('.sr-only');
    if (menuLabel) menuLabel.textContent = 'Открыть меню';
  }
}));

const form = document.querySelector('.contact-form');
const fields = [
  ['name', 'Пожалуйста, представьтесь.'],
  ['contact-detail', 'Укажите почту или телефон.'],
  ['brief', 'Опишите участок или задачу в двух словах.'],
];

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
  if (valid) {
    status.textContent = 'Спасибо. В демонстрационной версии форма не отправляет данные — подключите почту или CRM перед запуском в работу.';
  } else {
    status.textContent = 'Проверьте отмеченные поля.';
    form.querySelector('[aria-invalid="true"]')?.focus();
  }
});

