// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.glass-nav');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Animated counter
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.target === '98' ? '%' : '+');
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach((c) => counterObserver.observe(c));

// Scroll reveal
const reveals = document.querySelectorAll(
  '.feature-card, .step-item, .role-card, .result-mock, .result-features'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach((el) => { el.classList.add('reveal'); revealObserver.observe(el); });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
