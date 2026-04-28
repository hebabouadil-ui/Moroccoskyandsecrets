/* ============================================================================
   MOROCCO SKIES & SECRETS — script.js
   Vanilla JS, no dependencies.
   Handles: mobile menu, hero slideshow, scroll reveals, circuit filtering,
            booking form, EN/FR language toggle.
   ============================================================================ */

(function () {
  'use strict';

  /* -----------------------------------------------------------------
     1. MOBILE MENU TOGGLE
     ----------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------------------------------
     2. ACTIVE NAV LINK based on scroll position
     ----------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#navLinks a');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = 'home';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + currentId);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* -----------------------------------------------------------------
     3. HERO BACKGROUND SLIDESHOW
     ----------------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 6000);
  }

  /* -----------------------------------------------------------------
     4. SCROLL REVEAL — IntersectionObserver
     ----------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.section__head, .grid, .gallery, .about__media, .about__text, .booking__intro, .booking__form, .contact'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => io.observe(el));

  /* -----------------------------------------------------------------
     5. CIRCUIT FILTERING — by city or duration
     ----------------------------------------------------------------- */
  const chips    = document.querySelectorAll('.filters .chip');
  const circuits = document.querySelectorAll('#circuitGrid .card');
  const empty    = document.getElementById('filterEmpty');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filter = chip.dataset.filter;
      let visibleCount = 0;

      circuits.forEach(card => {
        const city = card.dataset.city;
        const days = parseInt(card.dataset.days, 10);
        let show = false;

        if (filter === 'all')                      show = true;
        else if (filter === 'short' && days <= 3)  show = true;
        else if (filter === 'long'  && days >= 5)  show = true;
        else if (city === filter)                  show = true;

        card.hidden = !show;
        if (show) visibleCount++;
      });

      if (empty) empty.hidden = visibleCount > 0;
    });
  });

  /* -----------------------------------------------------------------
     6. BOOKING FORM — frontend confirmation
     ----------------------------------------------------------------- */
  const bookingForm = document.getElementById('bookingForm');
  const successBox  = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!bookingForm.checkValidity()) { bookingForm.reportValidity(); return; }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Simulate sending (replace with real backend / EmailJS / Formspree etc.)
      setTimeout(() => {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bookingForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        setTimeout(() => { successBox.hidden = true; }, 8000);
      }, 800);
    });
  }

  /* -----------------------------------------------------------------
     7. LANGUAGE TOGGLE — EN / FR
     ----------------------------------------------------------------- */
  const translations = {
    en: {
      'meta.title': 'Morocco Skies & Secrets — Hot Air Balloon Flights, City Circuits & Tours',
      'meta.description': 'Sunrise hot air balloon flights over the Atlas, curated city circuits and cultural tours from Marrakech.',
      'nav.home': 'HOME',
      'nav.balloon': 'BALLOON FLIGHTS',
      'nav.circuits': 'CITY CIRCUITS',
      'nav.gallery': 'ROGUE GALLERY',
      'nav.about': 'ABOUT US',
      'nav.contact': 'CONTACT',
      'nav.book': 'BOOK NOW',
      'hero.book': 'Book Your Flight',
      'feat.balloon.t': 'HOT AIR BALLOONING',
      'feat.balloon.d': 'Rise above the Atlas: unforgettable sunrise flights.',
      'feat.circuit.t': 'CITY CIRCUIT TOURS',
      'feat.circuit.d': 'Discover ancient monuments, medinas, and historic sites.',
      'feat.gallery.t': 'THE ROGUE GALLERY',
      'feat.gallery.d': 'Explore our curated collection of art, history, and photography.',
      'foot.testimonials': 'TESTIMONIALS',
      'foot.quick': 'QUICK LINKS',
      'foot.contact': 'CONTACT US:',
      'balloon.kicker': '— Signature Experience',
      'balloon.title': 'Sunrise <em>balloon flights.</em>',
      'balloon.lead': 'Lift off from the plains of Marrakech just before dawn and watch the High Atlas turn from indigo to gold. Champagne and traditional Berber breakfast on landing.',
      'circuits.kicker': '— Multi-day journeys',
      'circuits.title': 'City <em>circuits.</em>',
      'gallery.kicker': '— The Rogue Gallery',
      'gallery.title': 'Art, history & <em>photography.</em>',
      'gallery.lead': 'A curated collection celebrating Moroccan craft — zellige, leather, calligraphy and the black-and-white desert photography of our founder.',
      'about.kicker': '— About us',
      'about.title': 'A Marrakech-born <em>family agency.</em>',
      'about.p1': 'Morocco Skies & Secrets is a Marrakech-based travel and ballooning company. We started with a single balloon over the palmeraie and grew into a full agency curating flights, city circuits and cultural experiences across the Kingdom.',
      'about.p2': 'All our pilots are licensed by the Moroccan Civil Aviation Authority, our vehicles are regularly serviced, and every itinerary is designed by people who actually live here.',
      'booking.kicker': '— Booking',
      'booking.title': 'Plan your <em>flight or trip.</em>',
      'booking.lead': "Tell us what you'd like to do and we'll come back within a few hours with a tailored quote. No deposit required to receive your itinerary.",
      'contact.kicker': '— Contact',
      'contact.title': 'Get in <em>touch.</em>'
    },
    fr: {
      'meta.title': 'Morocco Skies & Secrets — Vols en Montgolfière, Circuits et Excursions',
      'meta.description': 'Vols en montgolfière au lever du soleil au-dessus de l\'Atlas, circuits citadins et excursions culturelles depuis Marrakech.',
      'nav.home': 'ACCUEIL',
      'nav.balloon': 'MONTGOLFIÈRES',
      'nav.circuits': 'CIRCUITS',
      'nav.gallery': 'GALERIE',
      'nav.about': 'À PROPOS',
      'nav.contact': 'CONTACT',
      'nav.book': 'RÉSERVER',
      'hero.book': 'Réservez Votre Vol',
      'feat.balloon.t': 'VOL EN MONTGOLFIÈRE',
      'feat.balloon.d': 'Survolez l\'Atlas : des vols inoubliables au lever du soleil.',
      'feat.circuit.t': 'CIRCUITS DE VILLES',
      'feat.circuit.d': 'Découvrez monuments anciens, médinas et sites historiques.',
      'feat.gallery.t': 'LA GALERIE',
      'feat.gallery.d': 'Explorez notre collection d\'art, d\'histoire et de photographie.',
      'foot.testimonials': 'TÉMOIGNAGES',
      'foot.quick': 'LIENS RAPIDES',
      'foot.contact': 'CONTACTEZ-NOUS :',
      'balloon.kicker': '— Expérience signature',
      'balloon.title': 'Vols en montgolfière <em>au lever du soleil.</em>',
      'balloon.lead': 'Décollez des plaines de Marrakech juste avant l\'aube et regardez le Haut Atlas passer de l\'indigo à l\'or. Champagne et petit-déjeuner berbère traditionnel à l\'atterrissage.',
      'circuits.kicker': '— Voyages sur plusieurs jours',
      'circuits.title': 'Circuits <em>de villes.</em>',
      'gallery.kicker': '— La Galerie',
      'gallery.title': 'Art, histoire et <em>photographie.</em>',
      'gallery.lead': 'Une collection célébrant l\'artisanat marocain — zellige, cuir, calligraphie et la photographie noir et blanc du désert de notre fondateur.',
      'about.kicker': '— À propos',
      'about.title': 'Une agence familiale <em>née à Marrakech.</em>',
      'about.p1': 'Morocco Skies & Secrets est une agence de voyage et de montgolfière basée à Marrakech. Nous avons commencé avec une seule montgolfière au-dessus de la palmeraie et sommes devenus une agence complète proposant vols, circuits citadins et expériences culturelles à travers le Royaume.',
      'about.p2': 'Tous nos pilotes sont licenciés par l\'Autorité de l\'Aviation Civile Marocaine, nos véhicules sont régulièrement entretenus, et chaque itinéraire est conçu par des personnes qui vivent ici.',
      'booking.kicker': '— Réservation',
      'booking.title': 'Planifiez votre <em>vol ou voyage.</em>',
      'booking.lead': 'Dites-nous ce que vous voulez faire et nous reviendrons en quelques heures avec un devis personnalisé. Aucun acompte requis.',
      'contact.kicker': '— Contact',
      'contact.title': 'Prenez <em>contact.</em>'
    }
  };

  const langButtons = document.querySelectorAll('.lang-btn');
  const html = document.documentElement;

  function setLang(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = dict[key];
      if (!value) return;

      if (el.tagName === 'META')       el.setAttribute('content', value);
      else if (el.tagName === 'TITLE') document.title = value;
      // Allow lightweight HTML in titles (e.g. <em>...</em>)
      else if (value.includes('<em>')) el.innerHTML = value;
      else                              el.textContent = value;
    });

    html.setAttribute('lang', lang);
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    try { localStorage.setItem('mss_lang', lang); } catch (e) { /* ignore */ }
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  try {
    const saved = localStorage.getItem('mss_lang');
    if (saved && translations[saved]) setLang(saved);
  } catch (e) { /* ignore */ }

  /* -----------------------------------------------------------------
     8. SET DATE INPUTS' MIN to today
     ----------------------------------------------------------------- */
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.setAttribute('min', today);
  });

})();
