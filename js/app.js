let sistemaPedidos;
let modoActual = 'primaria';

document.addEventListener('DOMContentLoaded', () => {
    sistemaPedidos = new SistemaPedidos();
    sistemaPedidos.cargarPedidos();
    actualizarFechaActual();
    actualizarResumenRapido();
});

function actualizarFechaActual() {
    const fechaElement = document.getElementById('fecha-actual');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaElement.textContent = new Date().toLocaleDateString('es-CO', opciones);
}

function actualizarResumenRapido() {
    const pendientes = sistemaPedidos.pedidos.length;
    const entregasHoy = sistemaPedidos.obtenerPedidosDelDia().length;
    const abonosHoy = calcularAbonosDelDia();

    document.getElementById('total-pendientes').textContent = pendientes;
    document.getElementById('entregas-hoy').textContent = entregasHoy;
    document.getElementById('abonos-hoy').textContent = abonosHoy.toLocaleString();
}

function mostrarNuevoPedido() {
    const contenido = document.getElementById('contenido-principal');
    const template = document.getElementById('template-nuevo-pedido');
    contenido.innerHTML = '';
    contenido.appendChild(template.content.cloneNode(true));

    const numeroRecibo = sistemaPedidos.ultimoNumeroRecibo + 1;
    document.getElementById('numero-recibo').value = numeroRecibo;

    document.querySelectorAll('input[name="tipo-uniforme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            modoActual = e.target.id;
            actualizarListaPrendas();
        });
    });

    actualizarListaPrendas();
}

function actualizarListaPrendas() {
    const listaPrendas = document.getElementById('lista-prendas');
    listaPrendas.innerHTML = '';

    const prendas = PRECIOS[modoActual];
    for (const [tipo, tallas] of Object.entries(prendas)) {
        const prendaElement = document.createElement('div');
        prendaElement.classList.add('prenda-item');
        prendaElement.innerHTML = `
            <h4>${tipo}</h4>
            <select id="${tipo}-talla">
                ${Object.keys(tallas).map(talla => `<option value="${talla}">${talla} - $${tallas[talla]}</option>`).join('')}
            </select>
            <input type="number" id="${tipo}-cantidad" value="1" min="1">
        `;
        listaPrendas.appendChild(prendaElement);
    }
}

function crearNuevoPedido() {
    const fotoMedidas = document.getElementById('foto-medidas').files[0];
    const medidas = document.getElementById('medidas-jardinera').value;

    const prendas = Array.from(document.querySelectorAll('.prenda-item')).map(item => {
        const tipo = item.querySelector('h4').textContent;
        const talla = item.querySelector('select').value;
        const cantidad = parseInt(item.querySelector('input').value);
        return { tipo, talla, cantidad };
    });

    const datos = {
        cliente: document.getElementById('nombre-cliente').value,
        telefono: document.getElementById('telefono-cliente').value,
        tipoUniforme: modoActual,
        prendas: prendas,
        abono: parseFloat(document.getElementById('abono').value),
        estado: 'PENDIENTE',
        metodoPago: obtenerMetodoPago(),
        fotoMedidas: fotoMedidas,
        medidas: medidas
    };

    sistemaPedidos.crearNuevoPedido(datos);
}

function obtenerMetodoPago() {
    // Implementar lógica para obtener el método de pago
    return 'EFECTIVO'; // Ejemplo
}

function calcularAbonosDelDia() {
    // Implementar lógica para calcular abonos del día
    return 0; // Ejemplo
}
