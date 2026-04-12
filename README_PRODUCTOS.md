# 🖱️ CustomPad Studio — Guía de administración

## Estructura de archivos

```
tienda/
├── index.html              ← Tienda principal (catálogo)
├── product.html            ← Página de detalle de producto
├── offline.html            ← Página sin conexión (auto)
├── products.json           ← AQUÍ editas todo ✏️
├── manifest.json           ← Configuración PWA (nombre, iconos)
├── service-worker.js       ← Cache offline + detección de updates
├── icon-192.png            ← Icono app Android / pantalla inicio
├── icon-512.png            ← Icono app grande (splash)
├── images/                 ← Carpeta de imágenes
│   ├── mp001_small_1.jpg   ← Foto 1 del diseño en 19×30
│   ├── mp001_small_2.jpg   ← Foto 2 del diseño en 19×30
│   ├── mp001_large_1.jpg   ← Foto 1 del diseño en 28×30
│   └── ...
└── README_PRODUCTOS.md     ← Esta guía
```

> ⚠️ Los archivos JSON **no funcionan** abriendo el HTML directamente como archivo (`file://`).
> Usa un servidor local (Live Server en VSCode) o súbelo a **GitHub Pages**.

---

## Cómo funciona la tienda

- **`index.html`** muestra el catálogo. Cada tarjeta representa un diseño disponible en uno o ambos tamaños, con el rango de precio. Al hacer clic en la imagen va a la página de detalle.
- **`product.html`** muestra el detalle del producto: imagen grande, selector de talla (19×30 / 28×30), diagrama de costura, características, cantidad y opción de personalización. Todo cambia dinámicamente al cambiar la talla seleccionada.
- El **carrito** se mantiene mientras el cliente navega entre páginas (usando `sessionStorage`). Al finalizar, se genera un vale de pedido y se abre WhatsApp directamente.

---

## Añadir un nuevo diseño

Abre `products.json` y añade un objeto al array `"products"`:

```json
{
  "id": "mp009",
  "name": "Nombre del diseño",
  "description": "Descripción breve del diseño",
  "images": {
    "small": "images/mp009_small.jpg",
    "large": "images/mp009_large.jpg"
  },
  "available": true,
  "availableSizes": ["small", "large"],
  "tags": ["tag1", "tag2"]
}
```

### Campos explicados

| Campo            | Descripción                                                        |
|------------------|--------------------------------------------------------------------|
| `id`             | ID único. Sigue la secuencia: mp009, mp010, etc.                  |
| `name`           | Nombre del diseño que verá el cliente                              |
| `description`    | Descripción breve (1–2 líneas)                                     |
| `images`         | Objeto con la imagen por talla (ver detalle abajo)                 |
| `available`      | `true` para mostrar, `false` para ocultar sin borrar               |
| `availableSizes` | Qué tallas tiene este diseño: `["small"]`, `["large"]` o ambas    |
| `tags`           | Etiquetas internas (no se muestran al cliente, son para ti)        |

---

## Imágenes por talla

Cada diseño puede tener una imagen diferente según la talla, porque las proporciones físicas son distintas. Nombra los archivos así:

```
images/mp009_small.jpg   ← para 19 × 30 cm
images/mp009_large.jpg   ← para 28 × 30 cm
```

**Tamaño recomendado:** 900 × 600 px (relación 3:2), formato JPG.

Si solo tienes una imagen para ambas tallas, puedes poner la misma ruta en los dos campos:

```json
"images": {
  "small": "images/mp009.jpg",
  "large": "images/mp009.jpg"
}
```

Si la imagen no carga, la webapp muestra un placeholder morado automáticamente.

---

## Diseño solo en un tamaño

Si un diseño no lo quieres ofrecer en las dos tallas, simplemente pon solo la que corresponde en `availableSizes`:

```json
"availableSizes": ["small"]
```

En la página de producto, el botón de la otra talla aparecerá opaco e inactivo. No hace falta que pongas imagen para esa talla tampoco.

---

## Cambiar precios o costo de personalización

Todo en la sección `"store"` y `"sizes"` de `products.json`:

```json
"store": {
  "whatsapp": "+5353032939",
  "customizationFee": 0.50    ← costo extra por personalización
},
"sizes": [
  {
    "id": "small",
    "label": "19 × 30 cm",
    "price": 4.00             ← precio base talla pequeña
  },
  {
    "id": "large",
    "label": "28 × 30 cm",
    "price": 7.00             ← precio base talla grande
  }
]
```

---

## Cambiar el número de WhatsApp

En `products.json`, sección `"store"`:

```json
"store": {
  "whatsapp": "+5353032939"
}
```

Incluye el código de país sin espacios ni guiones.

---

## Ocultar un producto sin borrarlo

```json
"available": false
```

---

## Publicar una actualización (popup automático)

Cuando subes cambios a GitHub, los usuarios que tengan la app abierta o instalada ven automáticamente un banner **"Nueva versión disponible → Actualizar"**.

Para que esto funcione correctamente, **cada vez que subas cambios debes actualizar la versión** en la primera línea de `service-worker.js`:

```js
const APP_VERSION = 'v1.0.0';  ← cambia esto
```

Usa cualquier esquema que quieras: `v1.0.1`, `v2.0`, `2024-12-01`, etc. Lo importante es que sea diferente a la anterior. Eso invalida el cache viejo y dispara el popup de actualización en todos los usuarios.

---

## Publicar en GitHub Pages

1. Sube todos los archivos (`index.html`, `product.html`, `products.json`, carpeta `images/`) al repositorio
2. Ve a **Settings → Pages → Source:** rama `main`, carpeta `/ (root)`
3. GitHub Pages publica la URL automáticamente en unos segundos

Cada vez que edites `products.json` o añadas imágenes, haz commit y push — los cambios se reflejan solos.

---

## Ejemplo del vale de pedido en WhatsApp

Cuando el cliente pulsa "Ordenar por WhatsApp" desde el carrito, o "Pedir solo este producto" desde la página de detalle, recibe algo así:

```
¡Hola! Me gustaría hacer el siguiente pedido 🖱️

━━━━━━━━━━━━━━━
📋 VALE DE PEDIDO
━━━━━━━━━━━━━━━

1. Galaxia Oscura (×2)
   📐 Medida: 19 × 30 cm
   ✏️ Diseño prefabricado + personalización (+$0.50 c/u)
   💵 $4.50 × 2 = $9.00 USD

2. Neon City
   📐 Medida: 28 × 30 cm
   💵 $7.00 × 1 = $7.00 USD

━━━━━━━━━━━━━━━
💰 TOTAL: $16.00 USD
━━━━━━━━━━━━━━━

Quedo en espera de sus instrucciones para coordinar el pago y la entrega. ¡Gracias! 😊
```
