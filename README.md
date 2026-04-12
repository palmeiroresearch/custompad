# 🖱️ CustomPad Studio

**Tienda online de mousepads personalizados** — Progressive Web App construida con HTML, CSS y JavaScript puro. Sin backend, sin base de datos. Funciona completamente en GitHub Pages.

---

## ✨ Características

- 🛍️ **Catálogo de productos** con filtro por talla
- 🔍 **Página de detalle** con galería de fotos por talla, selector de tamaño dinámico y diagrama de costura SVG
- 🎨 **Opción de personalización** por producto con precio en tiempo real
- 🔢 **Selector de cantidad** en tarjeta y en carrito
- 🛒 **Carrito persistente** entre páginas (sessionStorage)
- 💬 **Pedido por WhatsApp** con vale de pedido detallado generado automáticamente
- 📱 **PWA instalable** — funciona como app nativa en Android e iOS
- ⚡ **Modo offline** — productos y páginas visitadas disponibles sin conexión
- 🔔 **Popup de actualización** automático cuando se publica una nueva versión

---

## 🗂️ Estructura del proyecto

```
/
├── index.html              # Catálogo principal
├── product.html            # Página de detalle de producto
├── offline.html            # Página sin conexión
├── products.json           # Base de datos del catálogo ← editar aquí
├── manifest.json           # Configuración PWA
├── service-worker.js       # Cache offline + detección de updates
├── icon-192.png            # Icono app
├── icon-512.png            # Icono app (grande)
├── images/                 # Fotos de los productos
│   ├── mp001_small_1.jpg
│   ├── mp001_small_2.jpg
│   ├── mp001_large_1.jpg
│   └── ...
└── README_PRODUCTOS.md     # Guía de administración del catálogo
```

---

## 🚀 Despliegue en GitHub Pages

1. Haz fork o sube este repositorio a GitHub
2. Ve a **Settings → Pages → Source:** rama `main`, carpeta `/ (root)`
3. GitHub Pages publicará la URL en unos segundos
4. Sube tus imágenes a la carpeta `images/` con la nomenclatura correcta

> La app no requiere servidor, base de datos ni dependencias externas.

---

## 🖼️ Añadir productos

Edita `products.json` y añade un objeto al array `products`:

```json
{
  "id": "mp009",
  "name": "Nombre del diseño",
  "description": "Descripción breve",
  "images": {
    "small": ["images/mp009_small_1.jpg", "images/mp009_small_2.jpg"],
    "large": ["images/mp009_large_1.jpg"]
  },
  "available": true,
  "availableSizes": ["small", "large"],
  "tags": ["tag1", "tag2"]
}
```

**Nomenclatura de imágenes:** `{id}_{talla}_{numero}.jpg`

```
mp009_small_1.jpg   ← foto 1 en 19×30 cm
mp009_small_2.jpg   ← foto 2 en 19×30 cm
mp009_large_1.jpg   ← foto 1 en 28×30 cm
```

Tamaño recomendado: **900 × 600 px**, formato JPG.  
Si un diseño solo está disponible en una talla, pon únicamente esa en `availableSizes`.

---

## 🔄 Publicar una actualización

Cada vez que subas cambios, actualiza la versión en `service-worker.js`:

```js
const APP_VERSION = 'v1.0.1'; // ← incrementa esto
```

Todos los usuarios con la app abierta o instalada verán automáticamente el banner **"Nueva versión disponible → Actualizar"**.

---

## 💰 Precios y configuración

Todo en la sección `store` y `sizes` de `products.json`:

```json
"store": {
  "whatsapp": "+53XXXXXXXX",
  "customizationFee": 0.50
},
"sizes": [
  { "id": "small", "label": "19 × 30 cm", "price": 4.00 },
  { "id": "large", "label": "28 × 30 cm", "price": 7.00 }
]
```

---

## 📋 Guía completa de administración

Ver [`README_PRODUCTOS.md`](./README_PRODUCTOS.md) para instrucciones detalladas sobre cómo gestionar el catálogo, imágenes, precios y actualizaciones.

---

## 🛠️ Tecnologías

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white)
