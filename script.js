
'use strict';

// MENÚ DE NAVEGACIÓN

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute(
      'aria-label',
      open ? 'Cerrar menú' : 'Abrir menú'
    );

    menuButton.textContent = open ? '✕' : '☰';
  });

  // Cierra el menú al elegir una sección
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
      menuButton.textContent = '☰';
    });
  });
}


// PREFERENCIAS DE MOVIMIENTO

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


// ANIMACIONES AL DESPLAZARSE

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reducedMotion) {
  // Muestra los elementos al entrar en pantalla
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Resalta la sección activa del menú
  if (nav) {
    const navObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          nav.querySelectorAll('a').forEach(link => {
            link.classList.toggle(
              'active',
              link.hash === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );

    document.querySelectorAll('main section[id]')
      .forEach(section => {
        navObserver.observe(section);
      });
  }
} else {
  // Muestra todo si se reducen animaciones
  revealElements.forEach(element => {
    element.classList.add('in');
  });
}


// FILTROS DE LA GALERÍA

const filterButtons = [
  ...document.querySelectorAll('.filter')
];

const photos = [
  ...document.querySelectorAll('.gallery-item')
];

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;

    // Actualiza el filtro seleccionado
    filterButtons.forEach(element => {
      const active = element === button;

      element.classList.toggle('active', active);
      element.setAttribute('aria-pressed', String(active));
    });

    // Muestra las imágenes de la categoría
    photos.forEach(photo => {
      photo.hidden =
        category !== 'all' &&
        photo.dataset.kind !== category;
    });
  });
});


// VISOR DE IMÁGENES

const dialog = document.querySelector('.lightbox');

if (dialog) {
  const dialogImage = dialog.querySelector('img');
  const dialogCaption = dialog.querySelector('p');
  const closeButton = dialog.querySelector('.lightbox-close');

  // Abre la imagen seleccionada
  photos.forEach(photo => {
    photo.addEventListener('click', () => {
      dialogImage.src = photo.dataset.full;
      dialogImage.alt = photo.querySelector('img').alt;
      dialogCaption.textContent = photo.dataset.caption;

      dialog.showModal();
    });
  });

  // Cierra el visor con el botón
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  // Cierra el visor al tocar el fondo
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}


// AÑO AUTOMÁTICO DEL PIE DE PÁGINA

const yearElement = document.querySelector('#year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// RATÓN INTERACTIVO EN CONTROLES

const mouseTip = document.querySelector('.mouse-tip');

if (mouseTip && !reducedMotion) {
  const mouseArea = mouseTip.querySelector('.mouse-playground');

  if (mouseArea) {
    // Mueve el dibujo según la posición del cursor
    mouseArea.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;

      const bounds = mouseArea.getBoundingClientRect();

      const dx =
        (event.clientX - bounds.left - bounds.width / 2) /
        (bounds.width / 2);

      const dy =
        (event.clientY - bounds.top - bounds.height / 2) /
        (bounds.height / 2);

      const moveX = Math.max(-1, Math.min(1, dx)) * 24;
      const moveY = Math.max(-1, Math.min(1, dy)) * 12;

      mouseTip.style.setProperty('--mx', `${moveX}px`);
      mouseTip.style.setProperty('--my', `${moveY}px`);
    });

    // Regresa el dibujo al centro
    mouseArea.addEventListener('pointerleave', () => {
      mouseTip.style.setProperty('--mx', '0px');
      mouseTip.style.setProperty('--my', '0px');
    });
  }
}


// BOTÓN FLOTANTE PARA SUBIR

const backToTop = document.createElement('button');

backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.textContent = '↑';

backToTop.setAttribute('aria-label', 'Volver al inicio');
backToTop.setAttribute('title', 'Volver al inicio');

document.body.appendChild(backToTop);

// Muestra el botón después de bajar 350 píxeles
function updateBackToTop() {
  const visible = window.scrollY > 350;

  backToTop.classList.toggle('is-visible', visible);
  backToTop.tabIndex = visible ? 0 : -1;
}

window.addEventListener('scroll', updateBackToTop, {
  passive: true
});

updateBackToTop();

// Regresa suavemente al principio
backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: reducedMotion ? 'auto' : 'smooth'
  });
});


