(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Highlight the sidebar link for the section in view */
  const links = $$('#sideNav a');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((s) => observer.observe(s));
  }

  /* Contact form: opens the visitor's email app with the message filled in */
  const RECIPIENT = 'your-email@example.com'; // replace with his real email
  const form = $('#contactForm');
  const status = $('#formStatus');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { name, email, message } = form.elements;
    let firstInvalid = null;
    [name, email, message].forEach((f) => {
      const ok = f.value.trim() !== '' && (f !== email || /^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      status.textContent = 'Fill in your name, a valid email and a message.';
      status.classList.add('is-error');
      firstInvalid.focus();
      return;
    }
    status.classList.remove('is-error');
    status.textContent = 'Opening your email app. If nothing opens, write to ' + RECIPIENT + '.';
    const subject = encodeURIComponent('Hello from ' + name.value.trim());
    const body = encodeURIComponent(message.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim());
    window.location.href = 'mailto:' + RECIPIENT + '?subject=' + subject + '&body=' + body;
  });
})();
