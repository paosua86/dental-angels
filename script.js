/* =============================================================
   DENTAL ANGELS · script.js
   Vanilla, sin dependencias. Solo dos cosas:
     1. Menú móvil (abrir/cerrar + accesibilidad).
     2. Cierre del menú al navegar a un ancla.
   El acordeón de FAQ usa <details>/<summary> nativos: no necesita JS.
   ============================================================= */
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open
      ? 'Cerrar menú de navegación'
      : 'Abrir menú de navegación';
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Al pulsar un enlace del menú, cerrarlo (solo aplica en móvil).
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Escape cierra el menú y devuelve el foco al botón.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Si se pasa a escritorio con el menú abierto, limpiar el estado.
  var desktop = window.matchMedia('(min-width: 900px)');
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange); // Safari < 14
})();
