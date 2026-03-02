/**
 * SkySoft Portfolio - Main JS File
 * Handles: Theme toggles, mobile menus, skill animations, lazy loading
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  initTheme();
  initMobileMenu();
  initAnimations();
  initSkillBars();
  initLazyLoading();
  initBackToTop();
  updateActiveLink(); // Initial check
});

// Update Active Link in Header
const updateActiveLink = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    const sectionId = current.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
  
  // Special case for Contact page
  if (window.location.pathname.includes('contact.html')) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && (href.includes('contact.html'))) {
        link.classList.add('active');
      }
    });

    // When on contact.html, update relative hash links to point back home
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.setAttribute('href', `index.html${href}`);
      }
    });
  }
};

window.addEventListener('scroll', updateActiveLink);

// Component Loader for Vanilla JS
const loadComponents = async () => {
  const elements = document.querySelectorAll('[data-component]');
  const promises = Array.from(elements).map(async (el) => {
    const component = el.getAttribute('data-component');
    try {
      const response = await fetch(`./src/layout/${component}.html`);
      const html = await response.text();
      el.innerHTML = html;
      // Re-trigger theme update after component load
      document.dispatchEvent(new Event('componentsLoaded'));
    } catch (err) {
      console.error(`Error loading component: ${component}`, err);
    }
  });
  await Promise.all(promises);
};

// Theme Management
const initTheme = () => {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const html = document.documentElement;

  const toggleHandler = () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateAriaLabels(isDark);
  };

  const updateAriaLabels = (isDark) => {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    if(themeToggle) themeToggle.setAttribute('aria-label', label);
    if(mobileThemeToggle) mobileThemeToggle.setAttribute('aria-label', label);
  };

  // Preference check
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    html.classList.add('dark');
    updateAriaLabels(true);
  }

  if(themeToggle) themeToggle.addEventListener('click', toggleHandler);
  if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleHandler);
};

// Mobile Menu
const initMobileMenu = () => {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if(!btn || !menu) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('hidden');
    menu.classList.toggle('animate-fade-in');
  });

  // Close when link clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
};

// Intersection Observer for Animations
const initAnimations = () => {
  const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-play');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// Skill Bar Activation
const initSkillBars = () => {
  const section = document.getElementById('skills');
  if(!section) return;

  const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
      section.querySelectorAll('.skill-bar-inner').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') || '0%';
      });
      observer.unobserve(section);
    }
  }, { threshold: 0.2 });

  observer.observe(section);
};

// Lazy Loading for Performance
const initLazyLoading = () => {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
};

// Back to Top functionality
const initBackToTop = () => {
  const btn = document.getElementById('back-to-top');
  if(!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible', 'opacity-100');
      btn.classList.remove('invisible', 'opacity-0');
    } else {
      btn.classList.remove('visible', 'opacity-100');
      btn.classList.add('invisible', 'opacity-0');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};
