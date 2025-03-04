let sistemaPedidos;

document.addEventListener('DOMContentLoaded', () => {
    sistemaPedidos = new SistemaPedidos();
    sistemaPedidos.cargarPedidos();
    actualizarFechaActual();
    actualizarResumenRapido();
    inicializarEventos();
});

function actualizarFechaActual() {
    const fechaElement = document.getElementById('fecha-actual');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaElement.textContent = new Date().toLocaleDateString('es-CO', opciones);
}

function actualizarResumenRapido() {
    const pendientes = sistemaPedidos.pedidos.length;
    const entregasHoy = sistemaPedidos.pedidos.filter(p => p.fecha.toDateString() === new Date().toDateString()).length;
    const abonosHoy = sistemaPedidos.pedidos.reduce((total, p) => total + p.abono, 0);

    document.getElementById('total-pendientes').textContent = pendientes;
    document.getElementById('entregas-hoy').textContent = entregasHoy;
    document.getElementById('abonos-hoy').textContent = abonosHoy.toLocaleString();
}

function mostrarNuevoPedido() {
    const contenido = document.getElementById('contenido-principal');
    const template = document.getElementById('template-nuevo-pedido');
    contenido.innerHTML = '';
    contenido.appendChild(template.content.cloneNode(true));
    document.getElementById('numero-recibo').value = sistemaPedidos.generarNuevoNumeroRecibo();
}

function crearNuevoPedido() {
    const datos = {
        numeroRecibo: document.getElementById('numero-recibo').value,
        cliente: document.getElementById('nombre-cliente').value,
        telefono: document.getElementById('telefono-cliente').value,
        tipoUniforme: document.querySelector('input[name="tipo-uniforme"]:checked').id,
        prendas: obtenerPrendasSeleccionadas(),
        abono: parseFloat(document.getElementById('abono').value),
        fotoMedidas: document.getElementById('foto-medidas').files[0],
        medidas: document.getElementById('medidas-jardinera').value
    };

    sistemaPedidos.crearNuevoPedido(datos);
    alert('Pedido creado con éxito');
}

function obtenerPrendasSeleccionadas() {
    // Implementar lógica para obtener las prendas seleccionadas
    return [];
}
