// models.js
export class Producto {
  constructor(
    id,
    nombre,
    categoria,
    altura,
    precioBase,
    precioOferta,
    costo,
    imagenes,
    gif,
    descripcion,
    estado,
    stock,
    fondo,  // 👈 fondo específico
    rareza  // 👈 NUEVO ATRIBUTO
  ) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.altura = altura;
    this.precioBase = precioBase;
    this.precioOferta = precioOferta || null;
    this.costo = costo;
    this.imagenes = Array.isArray(imagenes) && imagenes.length
      ? imagenes
      : ["/assets/img/placeholder.png"];
    this.gif = gif || null;
    this.descripcion = descripcion;
    this.estado = estado;
    this.stock = stock ?? 0;
    this.fondo = fondo || null;
    this.rareza = rareza ?? 1; // 👈 por defecto, rareza 1 (Figura pequeña)
  }
}