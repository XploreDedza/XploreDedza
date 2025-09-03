// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Hero Slider
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  function showSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    slides[idx].classList.add('active');
  }
  showSlide(0);
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);

  // Mobile Nav Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav__links');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.feature-item, .card, .testi-item').forEach(el => {
    observer.observe(el);
  });

  // Currency Toggle
  const toggle = document.getElementById('toggle-currency');
  toggle.addEventListener('change', () => {
    document.querySelectorAll('.price').forEach(el => {
      const mwk = +el.dataset.mwk;
      if (toggle.checked) {
        const usd = (mwk / 1000).toFixed(2);
        el.textContent = `USD $${usd}`;
      } else {
        el.textContent = `MWK ${mwk}`;
      }
    });
  });

  // Booking Form Logic
  const form = document.getElementById('booking-form');
  const peopleInput = document.getElementById('people');
  const tourSelect = document.getElementById('tour-type');
  const totalCostEl = document.getElementById('total-cost');
  const stats = { bookings: 0, people: 0, trees: 0 };

  function updateTotal() {
    const price = +tourSelect.selectedOptions[0]?.dataset.price || 0;
    const people = +peopleInput.value || 0;
    totalCostEl.textContent = price * people;
  }
  tourSelect.addEventListener('change', updateTotal);
  peopleInput.addEventListener('input', updateTotal);

  // Disable past dates
  const dateInput = document.getElementById('arrival-date');
  dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', e => {
    e.preventDefault();
    stats.bookings++;
    stats.people += +peopleInput.value;
    stats.trees = stats.bookings; // 1 tree per booking

    document.getElementById('stat-bookings').textContent = stats.bookings;
    document.getElementById('stat-people').textContent = stats.people;
    document.getElementById('stat-trees').textContent = stats.trees;

    // Show tree animation
    const treeAnim = document.getElementById('tree-animation');
    treeAnim.style.opacity = 1;
    setTimeout(() => { treeAnim.style.opacity = 0; }, 2000);

    form.reset();
    totalCostEl.textContent = '0';
  });

  // Initialize Leaflet Map
  const map = L.map('mapid').setView([-14.3667, 34.3333], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Sample pins
  const locations = [
    { coords: [-14.3667, 34.3333], name: 'Dedza Plateau', img: 'images/hero1.jpg' },
    { coords: [-14.4, 34.35], name: 'Kirk Range', img: 'images/hero2.jpg' },
    { coords: [-14.32, 34.38], name: 'Downsview Falls', img: 'images/hero3.jpg' },
  ];
  locations.forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map);
    marker.bindPopup(`<strong>${loc.name}</strong><br><img src="${loc.img}" style="width:100px;">`);
  });
});