// Main interactions: slider, hamburger, hero animation, smooth scroll, testimonials, blog fetch
document.addEventListener('DOMContentLoaded', ()=> {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hamburger toggle
  const hb = document.getElementById('hamburger');
  const mm = document.getElementById('mobileMenu');
  hb.addEventListener('click', ()=> {
    const open = mm.getAttribute('aria-hidden') === 'true' || mm.getAttribute('aria-hidden') === null;
    mm.setAttribute('aria-hidden', !open);
    mm.style.display = open ? 'block' : 'none';
  });

  // Hero slider (simple auto-play)
  const slides = document.querySelectorAll('.slide');
  let idx = 0;
  function showSlide(i){
    const container = document.querySelector('.hero-slider');
    container.style.transform = `translateX(-${i*100}%)`;
  }
  setInterval(()=>{ idx = (idx+1)%slides.length; showSlide(idx); },6000);

  // GSAP subtle hero overlay (moving light/clouds)
  const heroCanvas = document.getElementById('heroCanvas');
  if(heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    function resizeHero(){ heroCanvas.width = heroCanvas.clientWidth; heroCanvas.height = heroCanvas.clientHeight; }
    resizeHero(); window.addEventListener('resize', resizeHero);
    let t=0;
    function draw(){
      ctx.clearRect(0,0,heroCanvas.width,heroCanvas.height);
      // soft moving gradient overlay
      const g = ctx.createLinearGradient(0,0,heroCanvas.width,heroCanvas.height);
      g.addColorStop(0, `rgba(255,255,255,${0.02 + 0.02*Math.sin(t/300)})`);
      g.addColorStop(1, `rgba(0,0,0,${0.06 + 0.03*Math.cos(t/300)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0,0,heroCanvas.width,heroCanvas.height);
      t+=1;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Testimonials carousel (auto slide)
  const carousel = document.getElementById('testiCarousel');
  if(carousel){
    let slideIndex = 0;
    const slides = carousel.querySelectorAll('.testi-slide');
    function showTestimonial(i){
      slides.forEach((s,si)=> s.style.transform = `translateX(${(si-i)*100}%)`);
    }
    showTestimonial(0);
    setInterval(()=>{ slideIndex = (slideIndex+1)%slides.length; showTestimonial(slideIndex); },5000);
  }

  // Load blog feed (auto-fetch from local /feeds/blog.json or external CMS)
  const blogFeed = document.getElementById('blogFeed');
  if(blogFeed){
    fetch('/feeds/blog.json').then(r=>r.json()).then(posts=>{
      posts.slice(0,6).forEach(p=>{
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.innerHTML = `
          <img src="${p.thumbnail}" alt="${p.title}">
          <div style="padding:12px">
            <h3 style="font-family:Poppins;margin:0 0 8px">${p.title}</h3>
            <p style="margin:0 0 12px;color:var(--muted)">${p.excerpt}</p>
            <div style="display:flex;gap:8px">
              <a href="${p.url}" class="btn" style="padding:8px 12px;background:var(--green);color:#fff">Read</a>
              <div style="margin-left:auto;display:flex;gap:8px">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(p.url)}" target="_blank">FB</a>
                <a href="https://www.instagram.com/" target="_blank">IG</a>
                <a href="https://x.com/intent/tweet?url=${encodeURIComponent(p.url)}" target="_blank">X</a>
              </div>
            </div>
          </div>`;
        blogFeed.appendChild(card);
      });
    }).catch(()=> {
      // fallback: local cards
      blogFeed.innerHTML = '<p style="color:var(--muted)">Blog feed unavailable right now. Check back soon.</p>';
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Formspree success handling
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    bookingForm.addEventListener('submit', ()=> {
      // let Formspree handle the submit; optionally show a toast via JS on success
      // You can add an AJAX submission flow here if you prefer
    });
  }

});
