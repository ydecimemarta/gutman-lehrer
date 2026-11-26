# Gutman Lehrer Arquitectas — web

Sitio estático (HTML/CSS/JS) publicado con GitHub Pages.

- `index.html` — home
- `proyectos/<slug>/index.html` — fichas de proyecto (una carpeta por obra)
- `assets/css`, `assets/js`, `assets/img` — estilos, scripts e imágenes
  - `assets/css/ficha.css` y `assets/js/ficha.js` — estilos y lógica compartidos por todas las fichas
  - `assets/img/proyectos/glXX/` — fotos de cada obra en WebP (`GL03-01.webp`, etc.)
  - Cada ficha lleva sus datos propios (carrusel «Luz y materia», pares de antes / después) en `<script type="application/json" id="ficha-data">` y la carpeta de fotos en `<body data-img>`.
- Contenido: docs del proyecto (Documento maestro, decisiones de contenido, textos v1)
- Fotos: Google Drive › Gutman+Lehrer

Dominio propio: se agrega un archivo `CNAME` cuando esté listo.

## Fichas publicadas

| Código | Ficha |
|---|---|
| GL01 | `proyectos/duplex-en-palermo/` |
| GL02 | `proyectos/piso-en-bajo-belgrano/` |
| GL03 | `proyectos/piso-olleros/` |
| GL05 | `proyectos/piso-incas/` |
| GL06 | `proyectos/piso-en-av-del-libertador/` |
| GL07 | `proyectos/casa-en-altamira/` |
| GL10 | `proyectos/loft-urbano-casa-foa/` |

El panel de pruebas abajo a la izquierda (tipografía de títulos y color del footer) es temporal, para elegir con el estudio.
