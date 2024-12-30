// Productos disponibles
const productos = [
  { id: 1, nombre: "Cerveza Artesanal", precio: 500, tipo: "bebida", imagen: "imagenes/corona.jpg" },
  { id: 2, nombre: "Vino Tinto", precio: 800, tipo: "bebida", imagen: "imagenes/vino.webp" },
  { id: 3, nombre: "Whisky", precio: 1500, tipo: "bebida", imagen: "imagenes/whisky.png" },
  { id: 4, nombre: "Combo de 6 cervezas", precio: 2500, tipo: "combo", imagen: "imagenes/cervezax6.jpg" },
  { id: 5, nombre: "Combo de vodka y speed", precio: 3000, tipo: "combo", imagen: "imagenes/vodka+speed.jpg" },
  { id: 6, nombre: "Combo de champagne y speed", precio: 5000, tipo: "combo", imagen: "imagenes/champagne+speed.jpg" },
];

// Renderizar catálogo
const catalogoDiv = document.getElementById("catalogo");
productos.forEach((producto) => {
  const card = document.createElement("div");
  card.className = "col-md-4 mb-4";
  card.innerHTML = `
    <div class="card h-100">
      <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">Precio: $${producto.precio}</p>
        <button class="btn btn-success" onclick="agregarAlCarrito(${producto.id})">
          Agregar al Carrito
        </button>
      </div>
    </div>
  `;
  catalogoDiv.appendChild(card);
});

// Variables de carrito e historial
let carrito = [];
let historial = JSON.parse(localStorage.getItem("historialCompras")) || [];


// Actualizar carrito
function actualizarCarrito() {
  const carritoDiv = document.getElementById("carrito");
  const totalDiv = document.getElementById("totalCarrito");
  carritoDiv.innerHTML = "";

  let total = 0;
  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;
    const listItem = document.createElement("div");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `
      <span>${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}</span>
      <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">
        Quitar
      </button>
    `;
    carritoDiv.appendChild(listItem);
  });

  totalDiv.textContent = total;
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const itemCarrito = carrito.find((item) => item.id === id);

  if (itemCarrito) {
    itemCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Modal y cálculo de vuelto
const modalTotal = document.getElementById("modalTotal");
const dineroDadoInput = document.getElementById("dineroDado");
const vueltoCalculado = document.getElementById("vueltoCalculado");

document.getElementById("finalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  modalTotal.textContent = totalCarrito.toFixed(2);

  dineroDadoInput.value = "";
  vueltoCalculado.textContent = "0.00";
});

dineroDadoInput.addEventListener("input", () => {
  const dineroDado = parseFloat(dineroDadoInput.value) || 0;
  const totalCarrito = parseFloat(modalTotal.textContent);
  const vuelto = dineroDado - totalCarrito;

  vueltoCalculado.textContent = vuelto >= 0 ? vuelto.toFixed(2) : "0.00";
});

// Confirmar compra y guardar historial
document.getElementById("confirmarCompra").addEventListener("click", () => {
  const totalCarrito = parseFloat(modalTotal.textContent);
  const dineroDado = parseFloat(dineroDadoInput.value);

  if (dineroDado < totalCarrito) {
    alert("El dinero dado no es suficiente.");
    return;
  }

  const compra = {
    fecha: new Date().toLocaleString(),
    productos: [...carrito],
    total: totalCarrito,
    dineroDado,
    vuelto: dineroDado - totalCarrito,
  };

  historial.push(compra);
  localStorage.setItem("historialCompras", JSON.stringify(historial));
  mostrarHistorial();

  carrito = [];
  actualizarCarrito();

  const modalElement = bootstrap.Modal.getInstance(document.getElementById("vueltoModal"));
  modalElement.hide();
});

// Mostrar historial
function mostrarHistorial() {
  const historialDiv = document.getElementById("historial");
  historialDiv.innerHTML = "";

  historial.forEach((compra) => {
    // Validar que los valores sean numéricos y no nulos
    const total = parseFloat(compra.total) || 0;
    const dineroDado = parseFloat(compra.dineroDado) || 0;
    const vuelto = parseFloat(compra.vuelto) || 0;

    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `
      <strong>Fecha:</strong> ${compra.fecha} - 
      <strong>Total:</strong> $${total.toFixed(2)} -
      <strong>Dinero Dado:</strong> $${dineroDado.toFixed(2)} -
      <strong>Vuelto:</strong> $${vuelto.toFixed(2)}
      <ul>
        ${compra.productos
          .map((p) => `<li>${p.nombre} x${p.cantidad}</li>`)
          .join("")}
      </ul>
    `;
    historialDiv.appendChild(listItem);
  });
}


// Inicializar historial
mostrarHistorial();
