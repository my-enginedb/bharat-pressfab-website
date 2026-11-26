// Header scroll effect + scroll progress bar
var header = document.getElementById('header');
var scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', function() {
  header.classList.toggle('scrolled', window.scrollY > 10);

  // Progress bar
  if (scrollProgress) {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  // Back to top
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
});

// Mobile menu
var menuToggle = document.getElementById('menuToggle');
var mobileMenu = document.getElementById('mobileMenu');

if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
    var isOpen = mobileMenu.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = isOpen
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  });
}

function closeMobile() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }
}

// Scroll animations
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(function(el) {
  observer.observe(el);
});

// Animated counter stats
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      var text = el.textContent.trim();
      var match = text.match(/^(\d+)/);
      if (match && !el.dataset.counted) {
        el.dataset.counted = 'true';
        var target = parseInt(match[1]);
        var suffix = text.replace(match[1], '');
        var duration = 1600;
        var startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          el.innerHTML = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value').forEach(function(el) {
  counterObserver.observe(el);
});

// Back to top button
var backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Image lightbox
(function() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lbImg = lightbox.querySelector('.lightbox-img');
  var lbCounter = lightbox.querySelector('.lightbox-counter');
  var lbDotsWrap = lightbox.querySelector('.lightbox-dots');
  var images = [];
  var currentIndex = 0;

  function collectImages(gallery) {
    images = [];
    var imgs = gallery.querySelectorAll('img');
    imgs.forEach(function(img) { images.push(img.src); });
  }

  function showImage(index) {
    currentIndex = index;
    lbImg.src = images[index];
    lbImg.alt = 'Product image ' + (index + 1);
    if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + images.length;
    if (lbDotsWrap) {
      lbDotsWrap.innerHTML = '';
      images.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'lightbox-dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', 'Image ' + (i + 1));
        dot.addEventListener('click', function() { showImage(i); });
        lbDotsWrap.appendChild(dot);
      });
    }
  }

  function openLightbox(gallery, startIndex) {
    collectImages(gallery);
    showImage(startIndex || 0);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Product gallery images (detail pages)
  document.querySelectorAll('.product-gallery img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      var gallery = img.closest('.product-gallery');
      var imgs = gallery.querySelectorAll('img');
      var idx = Array.prototype.indexOf.call(imgs, img);
      openLightbox(gallery, idx);
    });
  });

  // Homepage product card images
  document.querySelectorAll('.product-card .card-img').forEach(function(img) {
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var grid = img.closest('.product-grid');
      openLightbox(grid, Array.prototype.indexOf.call(grid.querySelectorAll('.card-img'), img));
    });
  });

  // Awards grid images
  document.querySelectorAll('.awards-grid img').forEach(function(img) {
    img.addEventListener('click', function() {
      var grid = img.closest('.awards-grid');
      var imgs = grid.querySelectorAll('img');
      var idx = Array.prototype.indexOf.call(imgs, img);
      openLightbox(grid, idx);
    });
  });

  // Awards showcase (single image)
  var showcase = document.querySelector('.awards-showcase');
  if (showcase) {
    showcase.style.cursor = 'zoom-in';
    showcase.addEventListener('click', function() {
      images = [showcase.src];
      showImage(0);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  // Team photo (single image, click to enlarge)
  document.querySelectorAll('.team-photo').forEach(function(img) {
    img.addEventListener('click', function() {
      images = [img.src];
      showImage(0);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Infrastructure card images
  document.querySelectorAll('.infra-card img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      var grid = img.closest('.infra-grid');
      openLightbox(grid, Array.prototype.indexOf.call(grid.querySelectorAll('img'), img));
    });
  });

  // Close
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Nav
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
    showImage((currentIndex - 1 + images.length) % images.length);
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
    showImage((currentIndex + 1) % images.length);
  });

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') showImage((currentIndex + 1) % images.length);
  });

  // Double-click zoom
  lbImg.addEventListener('dblclick', function() {
    lbImg.classList.toggle('zoomed');
  });

  // Touch swipe
  var touchStartX = 0;
  lbImg.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lbImg.addEventListener('touchend', function(e) {
    var diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      lbImg.classList.remove('zoomed');
      if (diff > 0) showImage((currentIndex - 1 + images.length) % images.length);
      else showImage((currentIndex + 1) % images.length);
    }
  }, { passive: true });
})();

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sent';
  btn.style.background = 'var(--color-accent-600)';
  setTimeout(function() {
    btn.textContent = 'Submit enquiry';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
  return false;
}

// Enquiry modal
function handleEnquirySubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sent!';
  btn.style.background = 'var(--color-accent-600)';
  setTimeout(function() {
    btn.textContent = 'Send enquiry';
    btn.style.background = '';
    e.target.reset();
    closeEnquiryModal();
  }, 2000);
  return false;
}

function openEnquiryModal(productName) {
  var modal = document.getElementById('enquiryModal');
  var nameEl = document.getElementById('modalProductName');
  var productInput = document.getElementById('enquiryProduct');
  if (modal) {
    if (nameEl) nameEl.textContent = productName || '';
    if (productInput) productInput.value = productName || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeEnquiryModal() {
  var modal = document.getElementById('enquiryModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
(function() {
  var modal = document.getElementById('enquiryModal');
  var closeBtn = document.getElementById('modalClose');
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', closeEnquiryModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeEnquiryModal(); });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeEnquiryModal();
  });
})();

// Testimonials carousel
(function() {
  var track = document.getElementById('testimonialTrack');
  var dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;
  var slides = track.querySelectorAll('.testimonial-slide');
  var current = 0;
  var total = slides.length;

  function goTo(i) {
    current = i;
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    var dots = dotsWrap.querySelectorAll('.testimonial-dot');
    dots.forEach(function(d, idx) { d.classList.toggle('active', idx === i); });
  }

  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    (function(idx) { dot.addEventListener('click', function() { goTo(idx); }); })(i);
    dotsWrap.appendChild(dot);
  }

  var progressBar = document.querySelector('.testimonial-progress-bar');
  var interval = 5000;
  var progressStart = Date.now();
  var progressFrame;

  function animateProgress() {
    if (!progressBar) return;
    var elapsed = Date.now() - progressStart;
    var pct = Math.min((elapsed / interval) * 100, 100);
    progressBar.style.width = pct + '%';
    if (pct < 100) progressFrame = requestAnimationFrame(animateProgress);
  }

  function resetProgress() {
    progressStart = Date.now();
    if (progressBar) progressBar.style.width = '0%';
    if (progressFrame) cancelAnimationFrame(progressFrame);
    animateProgress();
  }

  resetProgress();
  setInterval(function() { goTo((current + 1) % total); resetProgress(); }, interval);
})();

// Dark mode toggle
(function() {
  var toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch(e) {}
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  toggle.addEventListener('click', function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
    }
  });
})();

// Hero image slider
(function() {
  var slider = document.getElementById('heroSlider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  var current = 0;
  setInterval(function() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();

// WhatsApp widget
(function() {
  var bubble = document.getElementById('waBubble');
  var greeting = document.getElementById('waGreeting');
  if (!bubble) return;

  bubble.addEventListener('click', function() {
    window.open('https://wa.me/912067901234?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20your%20products.', '_blank');
  });

  setTimeout(function() {
    if (greeting) { greeting.classList.add('show'); setTimeout(function() { greeting.classList.remove('show'); }, 5000); }
  }, 3000);
})();

// Sticky Get a Quote bar
(function() {
  var bar = document.getElementById('stickyQuoteBar');
  if (!bar) return;
  var heroHeight = 600;
  var contactSection = document.getElementById('contact');

  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var contactTop = contactSection ? contactSection.getBoundingClientRect().top + scrollY : Infinity;
    if (scrollY > heroHeight && scrollY < contactTop - window.innerHeight) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  });
})();

// Cookie consent
function acceptCookies() {
  var banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('visible');
  try { localStorage.setItem('cookieConsent', 'accepted'); } catch(e) {}
}
function declineCookies() {
  var banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('visible');
  try { localStorage.setItem('cookieConsent', 'declined'); } catch(e) {}
}
(function() {
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;
  var consent = null;
  try { consent = localStorage.getItem('cookieConsent'); } catch(e) {}
  if (!consent) {
    setTimeout(function() { banner.classList.add('visible'); }, 2000);
  }
})();

// Language toggle (English / Hindi)
(function() {
  var toggle = document.getElementById('langToggle');
  var label = document.getElementById('langLabel');
  if (!toggle || !label) return;

  var translations = {
    'Engineering excellence since 1991': '1991 से इंजीनियरिंग उत्कृष्टता',
    'Precision sheet metal solutions you can depend on': 'भरोसेमंद प्रिसिजन शीट मेटल समाधान',
    'Submit an enquiry': 'पूछताछ करें',
    'View products': 'उत्पाद देखें',
    'About the company': 'कंपनी के बारे में',
    'Industries we serve': 'जिन उद्योगों की हम सेवा करते हैं',
    'Product range': 'उत्पाद श्रेणी',
    'Manufacturing capabilities': 'विनिर्माण क्षमताएं',
    'Get in touch': 'संपर्क करें',
    'Start a conversation': 'बातचीत शुरू करें',
    'What our partners say': 'हमारे भागीदार क्या कहते हैं',
    'How we work': 'हम कैसे काम करते हैं',
    'Quality assurance': 'गुणवत्ता आश्वासन',
    'Our valued clients': 'हमारे मूल्यवान ग्राहक'
  };

  var isHindi = false;
  var originalTexts = {};

  toggle.addEventListener('click', function() {
    isHindi = !isHindi;
    label.textContent = isHindi ? 'EN' : 'HI';

    var eyebrows = document.querySelectorAll('.eyebrow');
    var headings = document.querySelectorAll('h1, h2');

    if (isHindi) {
      eyebrows.forEach(function(el) {
        var text = el.textContent.trim();
        if (translations[text]) {
          originalTexts[el] = text;
          el.textContent = translations[text];
        }
      });
      headings.forEach(function(el) {
        var text = el.textContent.trim();
        if (translations[text]) {
          originalTexts[el] = text;
          el.textContent = translations[text];
        }
      });
    } else {
      for (var el in originalTexts) {
        if (originalTexts.hasOwnProperty(el)) {
          try { el.textContent = originalTexts[el]; } catch(e) {}
        }
      }
      eyebrows.forEach(function(el) {
        if (originalTexts.get) return;
      });
    }
  });
})();

// Blog search and filter
(function() {
  var searchInput = document.getElementById('blogSearch');
  var filterBtns = document.querySelectorAll('.blog-filter-btn');
  var cards = document.querySelectorAll('.blog-card[data-category]');
  if (!searchInput && filterBtns.length === 0) return;

  var currentFilter = 'all';

  function filterCards() {
    var searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    cards.forEach(function(card) {
      var category = card.getAttribute('data-category');
      var title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      var body = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      var matchCategory = currentFilter === 'all' || category === currentFilter;
      var matchSearch = !searchTerm || title.indexOf(searchTerm) > -1 || body.indexOf(searchTerm) > -1;
      card.setAttribute('data-hidden', !(matchCategory && matchSearch));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      filterCards();
    });
  });
})();
