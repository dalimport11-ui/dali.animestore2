// products.js (control por JS usando display, compatible con remover reglas CSS de opacity)
import { productosSeed } from "./seed.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productosContainer");
  const productos = productosSeed || [];

  const fondosPorCategoria = {
    "Dragon Ball": "/assets/img/fondos/fondodbz.jfif",
    "One Piece": "/assets/img/fondos/fondoprueba.png",
    "Demon Slayer": "/assets/img/fondos/fondokny.png",
    "Funko Pop": "/assets/img/fondos/fondofunko.png",
    "Gaming": "/assets/img/fondos/fondogaming.png",
    "Figuras Anime": "/assets/img/fondos/fondofiguras.png",
    "Coleccionables": "/assets/img/fondos/fondocoleccionables.png",
    "default": "/assets/img/fondos/fondodefault.png"
  };

  function renderProductos(lista) {
    container.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
      container.innerHTML = `<p class="no-productos">No hay productos disponibles en esta categoría 🥲</p>`;
      return;
    }

    lista.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("product-card");
    
      // 🆕 Añadir clase según rareza (1-4)
      const rarezaClass = `rareza-${prod.rareza ?? 1}`;
      card.classList.add(rarezaClass);
    
      // 👇 primero usa fondo personalizado, luego fondo por categoría, y finalmente el default
      const fondo = prod.fondo || fondosPorCategoria[prod.categoria] || fondosPorCategoria["default"];
    
      const imagenesArr = Array.isArray(prod.imagenes) ? prod.imagenes : [];
      const imgPrincipalSrc = imagenesArr[0] || "/assets/img/placeholder.png";
      const imgHoverSrc = prod.gif || prod.imagenGif || imagenesArr[1] || imagenesArr[0] || "/assets/img/placeholder.png";
    
      // ✅ GIF lazy-loading (solo se descarga cuando entra en el viewport)
      card.innerHTML = `
        <div class="product-title">${escapeHtml(prod.nombre)}</div>
        <div class="img-wrapper" style="background-image: url('${fondo}')">
          <img class="img-static" src="${imgPrincipalSrc}" alt="${escapeHtml(prod.nombre)}" loading="lazy">
          <img class="img-hover lazy-gif" data-src="${imgHoverSrc}" alt="${escapeHtml(prod.nombre)}" style="display:none">
        </div>
        <div class="product-info">
          <p class="altura">Altura: ${prod.altura ?? 'N/A'} </p> 
          <p>${escapeHtml(prod.descripcion || '')}</p>
          ${
            prod.precioOferta
              ? `<p class="price"><span class="price-tachado">$${Number(prod.precioBase).toLocaleString()}</span> <span class="price-oferta">$${Number(prod.precioOferta).toLocaleString()}</span></p>`
              : `<p class="price">$${Number(prod.precioBase).toLocaleString()}</p>`
          }
          <button class="btn-agregar" data-id="${prod.id}">Agregar 🛒</button>
        </div>
      `;
    
      const imgStaticEl = card.querySelector(".img-static");
      const imgHoverEl = card.querySelector(".img-hover");

      // Inicial: mostrar estática, ocultar hover
      if (imgStaticEl) imgStaticEl.style.display = "block";
      if (imgHoverEl) imgHoverEl.style.display = "none";

      // Fallback si hover es diferente
      const hoverIsDifferent =
        imgHoverEl &&
        imgStaticEl &&
        new URL(imgHoverEl.getAttribute("data-src"), location.href).href !==
          new URL(imgStaticEl.src, location.href).href;

      // Eventos hover (se mantienen iguales)
      card.addEventListener("mouseenter", () => {
        if (!imgHoverEl || !hoverIsDifferent) return;
        imgStaticEl.style.display = "none";
        imgHoverEl.style.display = "block";
      });

      card.addEventListener("mouseleave", () => {
        if (!imgHoverEl || !hoverIsDifferent) return;
        imgHoverEl.style.display = "none";
        imgStaticEl.style.display = "block";
      });

      // Error handling
      if (imgHoverEl) {
        imgHoverEl.addEventListener("error", () => {
          imgHoverEl.style.display = "none";
        });
      }

      if (imgStaticEl) {
        imgStaticEl.addEventListener("error", () => {
          imgStaticEl.src = "/assets/img/placeholder.png";
          imgStaticEl.style.display = "block";
        });
      }

      container.appendChild(card);
    });

    // 🔥 Después de renderizar, activa lazy loading de los GIFs
    lazyLoadGifs();
  }

  // 🧠 Lazy loading real para GIFs
  function lazyLoadGifs() {
    const lazyGifs = document.querySelectorAll('.lazy-gif[data-src]');

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
            }
            obs.unobserve(img);
          }
        });
      }, { rootMargin: "200px 0px", threshold: 0.1 });

      lazyGifs.forEach(img => observer.observe(img));
    } else {
      // fallback para navegadores antiguos
      lazyGifs.forEach(img => {
        const src = img.getAttribute("data-src");
        if (src) img.src = src;
        img.removeAttribute("data-src");
      });
    }
  }

  // Filtro por categoría (sin cambios)
  document.addEventListener("filtrarCategoria", e => {
    const categoria = e.detail?.categoria || "todos";
    const filtrados = categoria === "todos" ? productos : productos.filter(p => p.categoria === categoria);
    renderProductos(filtrados);
  });

  // Render inicial
  renderProductos(productos);

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
});
