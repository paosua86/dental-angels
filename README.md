# Dental Angels — sitio web

Sitio estático de `dentalangelsecuador.com`. HTML + CSS a mano, un JS mínimo,
sin build step, sin dependencias salvo Google Fonts.

```
index.html          Home completa
privacidad.html     Política de privacidad (LOPDP) — obligatoria para WhatsApp Cloud API
terminos.html       Términos de uso
styles.css          Todo el CSS, comentado por secciones numeradas
script.js           Solo menú móvil (el FAQ usa <details> nativo)
assets/logo.png     Logo oficial, recortado y con fondo transparente (343x88, se muestra a 38px de alto)
assets/favicon.png  Favicon: el diente con la aureola, sobre fondo marfil (256x256)
assets/apple-touch-icon.png   Icono para iOS (180x180)
CNAME               Dominio propio para GitHub Pages
.nojekyll           Evita que GitHub procese el sitio con Jekyll
.github/workflows/deploy.yml  Despliegue automático
```

Funciona abriendo `index.html` con doble clic. Todas las rutas son relativas.

---

## 1. Ver el sitio en local

Doble clic en `index.html` funciona, pero para probarlo como en producción
(rutas absolutas, mapas embebidos) levanta un servidor:

```bash
python -m http.server 8787 --bind 127.0.0.1
```

Y abre `http://127.0.0.1:8787`. Se para con `Ctrl+C`.

---

## 2. Desplegar en GitHub Pages con Actions

El workflow ya está en `.github/workflows/deploy.yml`: no hay build, sube el repo
entero y publica. Cada `git push` a `main` redespliega solo.

**Subir a GitHub**

```bash
git init && git add . && git commit -m "Sitio Dental Angels" && git branch -M main
```

```bash
git remote add origin https://github.com/<usuario>/dental-angels.git && git push -u origin main
```

**Activar Pages**

1. Repo → *Settings* → *Pages*.
2. En *Build and deployment* → *Source*, elige **GitHub Actions** (no "Deploy from a branch").
3. Vuelve a *Actions* y comprueba que el workflow terminó en verde. Sale una URL
   `https://<usuario>.github.io/dental-angels/`.

> Si el repo es **privado**, Pages solo funciona en planes de pago. Con un repo público
> no hay problema: el sitio no tiene nada secreto.

**Dominio propio**

El DNS de `dentalangelsecuador.com` está en **Bluehost** (ns1/ns2.bluehost.com),
no en Cloudflare. Se gestiona en *cPanel → Domains → dentalangelsecuador.com → DNS*.

Zona configurada el 21/08/2026:

| Tipo | Host | Apunta a | Para qué |
|---|---|---|---|
| A | `@` | `185.199.108.153` | GitHub Pages |
| A | `@` | `185.199.109.153` | GitHub Pages |
| A | `@` | `185.199.110.153` | GitHub Pages |
| A | `@` | `185.199.111.153` | GitHub Pages |
| CNAME | `www` | `paosua86.github.io` | GitHub Pages |
| MX | `@` | `mx.zoho.com` | **Correo Zoho — no tocar** |
| MX | `@` | `mx2.zoho.com` | **Correo Zoho — no tocar** |
| MX | `@` | `mx3.zoho.com` | **Correo Zoho — no tocar** |
| TXT | `@` | `v=spf1 include:zoho.com ~all` | **SPF de Zoho — no tocar** |
| TXT | `@` | `zoho-verification=...` | **Zoho — no tocar** |
| TXT | `zmail._domainkey` | `v=DKIM1; ...` | **DKIM de Zoho — no tocar** |

Se eliminaron el comodín `A *` y el `A www` que apuntaban a la página de
parqueo de Bluehost (`66.81.203.198`).

> **Nunca toques los MX ni los TXT.** Son el correo de Zoho
> (`hola@` y `empresas@`). Borrar uno tumba el correo del dominio.

**Último paso, cuando el DNS propague** (Bluehost avisa de 24-48 h):

1. *Settings → Pages → Custom domain*: escribir `dentalangelsecuador.com` y guardar.
   Con despliegue por Actions, el archivo `CNAME` del repo **no** basta: hay que
   ponerlo aquí a mano. Si el DNS todavía no resuelve a GitHub, el campo se
   vacía solo al guardar; hay que reintentarlo más tarde.
2. Esperar a que GitHub emita el certificado y marcar **Enforce HTTPS**.

Comprobar la propagación:

```bash
nslookup dentalangelsecuador.com 8.8.8.8
```

Cuando devuelva una IP `185.199.1xx.153` en vez de `66.81.203.198`, ya se puede
configurar el dominio en GitHub.

**Verificación de Meta:** el dominio debe verificarse en
*Business Settings → Brand Safety → Domains*. Lo más cómodo es la meta etiqueta:
Meta te da un `<meta name="facebook-domain-verification" content="...">`
que va en el `<head>` de `index.html`, justo debajo del `<title>`.

---

## 3. Dónde editar cada texto

| Qué quieres cambiar | Dónde |
|---|---|
| Título y descripción SEO | `<title>` y `<meta name="description">` de cada `.html` |
| Open Graph / imagen social | bloque `<!-- Open Graph / Twitter -->` del `<head>` |
| Titular del hero y CTAs | `index.html`, sección `<!-- HERO -->` |
| Sección del miedo | `index.html`, `<section class="miedo">` — cada objeción es un `<article class="miedo-card">` |
| Servicios | `index.html`, `<ul class="serv-grid">` — un `<li>` por tratamiento |
| Diseño de sonrisa | `index.html`, `<section class="sonrisa">` |
| Historia madre e hija | `index.html`, `<section class="historia">` |
| Direcciones, horarios y mapas | `index.html`, `<section class="sedes">` — un `<article class="sede-card">` por sede |
| Convenios corporativos | `index.html`, `<section class="empresas">` |
| Preguntas frecuentes | `index.html`, `<div class="acordeon">` — cada pregunta es un `<details class="faq-item">` |
| Footer legal (SRI) | bloque `<footer class="site-footer">` en **las tres** páginas. **No reescribir: debe coincidir carácter por carácter con el certificado del SRI.** |
| Colores, tipografías, espaciados | `styles.css`, sección **1. TOKENS** (variables `--c-*`, `--f-*`, `--s-*`) |
| Textos legales | `privacidad.html` y `terminos.html` |

### Botones de WhatsApp

Todos apuntan a `https://wa.me/593961165325?text=<mensaje>`, con un **mensaje distinto por
sección** para saber desde dónde escribió la persona:

| Sección | Mensaje precargado |
|---|---|
| Header, hero, contacto, botón flotante | Hola, quiero agendar una cita |
| Sección del miedo | Hola, me da miedo el dentista y quisiera una primera cita tranquila |
| Diseño de sonrisa | Hola, me interesa el diseño de sonrisa |
| Sede Quito | Hola, quiero agendar en la sede de Quito |
| Sede Ambato | Hola, quiero agendar en la sede de Ambato |
| Empresas | Hola, quiero información sobre convenios corporativos |

Si añades un botón nuevo, dale un mensaje propio y anótalo aquí. El texto va
**URL-encoded** (espacios `%20`, `ñ` → `%C3%B1`, `í` → `%C3%AD`).

### Añadir un mapa de Google

En Google Maps: *Compartir → Insertar un mapa → Copiar HTML*. Pega el `<iframe>` dentro del
`<div class="mapa">` de la sede, reemplazando el `media-placeholder`, y déjalo así:

```html
<iframe class="mapa-frame" title="Mapa de la sede de Quito" src="https://www.google.com/maps/embed?pb=..." loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

`loading="lazy"` es obligatorio: sin eso el Lighthouse de móvil se cae.

### Añadir fotos

Reemplaza cada `<div class="media-placeholder">` por:

```html
<img src="assets/equipo.webp" alt="Descripción real de la foto" width="900" height="675" loading="lazy" decoding="async" style="border-radius:22px">
```

Convierte a `.webp`, ancho máximo 900 px, y **siempre** con `width`/`height` explícitos
para que no haya CLS. La única foto que **no** lleva `loading="lazy"` es la que quede
por encima del pliegue, si añades alguna al hero.

---

## 4. TODOs pendientes (datos que faltan)

Todos están marcados en el código con `<!-- TODO: ... -->` y con un texto amarillo
`PENDIENTE` visible en pantalla, para que no se publique nada por accidente.

**Buscar con:** `grep -rn "TODO:" .` o `grep -rn "PENDIENTE" .`

- [ ] **Logo vectorial**: solo había `.ai` y `.png`, así que el sitio usa el PNG recortado.
      Funciona bien, pero si consigues un `.svg` exportado desde el `.ai`, cámbialo:
      pesa menos y se ve nítido en pantallas retina. Los colores ya salen del logo
      (`#DBA628` dorado, `#231F20` tinta) en la sección 1 de `styles.css`.
- [x] ~~Dirección de Ambato~~ → Calle Salvador 5-19 y México, parroquia La Merced.
- [x] ~~Horarios~~ → Quito L-V 10:00-18:00 · Ambato L-V 9:00-13:00 y 15:00-18:00.
      **Verificar si abren sábados**: ahora mismo el sitio dice que no.
- [x] ~~Mapas y coordenadas~~ → embebidos sin API key y con `hasMap` en el JSON-LD.
- [ ] **Nombres completos y especialidades de las doctoras** (y del resto del equipo)
      → sección historia. Considerar añadir un bloque de equipo.
- [ ] **Foto de las doctoras sin decoración navideña** → la actual
      (`assets/dras-juntas.webp`) tiene espumillón de Navidad de fondo. Sirve para salir,
      pero conviene cambiarla o el sitio se ve viejo en marzo.
- [ ] **Foto de sonrisa en mejor resolución** → la actual (`assets/sonrisa.webp`) sale de un
      frame de video de 640x464 y se ve suave en pantallas grandes.
- [ ] **Fotos del consultorio** e **imagen social** `assets/og-dental-angels.jpg` (1200×630).
- [x] ~~Correo de contacto~~ → ya puestos: `hola@` (general, responsable de datos y
      derechos ARCO+) y `empresas@` (convenios corporativos).
      **Falta crearlos de verdad en el proveedor de correo: Meta comprueba que el correo
      de la política de privacidad reciba mensajes.**
- [x] ~~Seguros~~ → el sitio dice que se factura en regla para que el paciente pida el
      reembolso a su seguro, sin nombrar aseguradoras concretas.
- [x] ~~Precio de la valoración~~ → sin costo agendando por WhatsApp.
- [ ] **Meta etiqueta de verificación de dominio de Meta** → `<head>` de `index.html`.
- [ ] **Píxel de Meta**, si se va a instalar → antes de `</head>`. Ya está declarado en
      `privacidad.html`; si finalmente no se usa, quitar ese párrafo.
- [ ] **Fechas de "última actualización"** en `privacidad.html` y `terminos.html` cuando
      se editen esos textos.

---

## 5. Checklist antes de publicar

- [ ] Ningún `PENDIENTE` amarillo visible en la página.
- [ ] `grep -rn "TODO:" .` no devuelve nada crítico.
- [ ] El footer coincide **carácter por carácter** con el certificado del SRI.
- [ ] `privacidad.html` carga en HTTPS y su URL es la que se pega en la App de WhatsApp
      Cloud API (*App Dashboard → Settings → Basic → Privacy Policy URL*).
- [ ] El correo de contacto de la política existe y alguien lo lee.
- [ ] JSON-LD validado en `search.google.com/test/rich-results` (fallará mientras haya
      `PENDIENTE` en `geo` y `openingHours`).
- [ ] Lighthouse móvil > 95 en performance y accesibilidad.
- [ ] Probado con teclado: `Tab` recorre todo y el foco se ve siempre.

---

## 6. Notas técnicas

- **Sin dark mode**, por decisión de marca. No hay bloques `prefers-color-scheme`.
- **`prefers-reduced-motion`** desactiva todas las transiciones (sección 19 del CSS).
- **Acordeón FAQ**: `<details>`/`<summary>` nativos. Accesible por teclado sin JS y
  funciona aunque el JS falle.
- **JS**: solo el menú móvil, cargado con `defer`. Si se elimina el menú, se puede borrar
  `script.js` entero.
- **Fuentes**: Fraunces (serif, titulares) e Inter (sans, cuerpo), con `display=swap` y
  `preconnect`. Fallbacks reales declarados en `--f-serif` y `--f-sans`.
- El botón flotante de WhatsApp se oculta en escritorio (≥900 px) porque el del header
  ya está siempre visible.
