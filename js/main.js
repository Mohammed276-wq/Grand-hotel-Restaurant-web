// Grand Hotel — front-end interactivity (no dependencies)

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }

  /* ---------- Scroll-triggered fade-in animations ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach((el) => observer.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Booking widget (front-end only) ---------- */
  const bookingForm = document.getElementById('booking-form');
  const bookingFeedback = document.getElementById('booking-feedback');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if (checkinInput && checkoutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;
    checkoutInput.min = today;

    checkinInput.addEventListener('change', () => {
      checkoutInput.min = checkinInput.value || today;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = '';
      }
    });
  }

  if (bookingForm && bookingFeedback) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (checkinInput.value && checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        bookingFeedback.textContent = 'Check-out date must be after check-in date.';
        bookingFeedback.classList.add('text-red-600');
        return;
      }

      const guests = document.getElementById('guests').value;
      const roomType = document.getElementById('room-type').value;
      bookingFeedback.classList.remove('text-red-600');
      bookingFeedback.textContent = `Great! We're checking availability for ${guests}, ${roomType} rooms. Our reservations team will follow up shortly.`;
      bookingForm.reset();
    });
  }

  /* ---------- Newsletter signup (front-end only) ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterFeedback.textContent = "Thanks for subscribing — welcome to the Grand Hotel list.";
      newsletterForm.reset();
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;
  let lastFocusedEl = null;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lastFocusedEl = document.activeElement;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function showRelative(offset) {
    currentIndex = (currentIndex + offset + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showRelative(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showRelative(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showRelative(1);
      if (e.key === 'ArrowLeft') showRelative(-1);
    });
  }
});
