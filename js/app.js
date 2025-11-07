

  import { seedProductos } from "./seed.js";

document.addEventListener("DOMContentLoaded", () => {
  const productos = seedProductos();
  console.log("🛍️ Catálogo inicial:", productos);
});
