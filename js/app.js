class UniformesApp {
    constructor() {
        this.pedidos = [];
        this.ultimoNumeroRecibo = 0;
        this.inicializar();
    }

    inicializar() {
        this.cargarDatosGuardados();
        this.actualizarFechaActual();
        this.actualizarResumen();
        this.inicializarEventos();
    }

    cargarDatosGuardados() {
        const pedidosGuardados = localStorage.getItem('pedidos');
        if (pedidosGuardados) {
            this.pedidos = JSON.parse(pedidosGuardados);
        }
        const ultimoRecibo = localStorage.getItem('ultimoNumeroRecibo');
        if (ultimoRecibo) {
            this.ultimoNumeroRecibo = parseInt(ultimoRecibo);
        }
    }

    actualizarFechaActual() {
        const fechaElement = document.getElementById('fecha-actual');
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaElement.textContent = new Date().toLocaleDateString('es-CO', opciones);
    }

    actualizarResumen() {
        const pendientes = this.pedidos.filter(p => p.estado !== 'cancelado_entregado').length;
        const abonosHoy = this.calcularAbonosHoy();
        
        document.getElementById('total-pendientes').textContent = pendientes;
        document.getElementById('abonos-hoy').textContent = abonosHoy.toLocaleString();
    }

    calcularAbonosHoy() {
        const hoy = new Date().toDateString();
        return this.pedidos
            .filter(p => new Date(p.fecha).toDateString() === hoy)
            .reduce((total, p) => total + (p.abono || 0), 0);
    }

    mostrarNuevoPedido() {
        const contenido = document.getElementById('contenido-principal');
        const template = document.getElementById('template-nuevo-pedido');
        contenido.innerHTML = template.innerHTML;

        // Configurar fecha actual
        const fechaInput = document.getElementById('fecha-pedido');
        fechaInput.valueAsDate = new Date();

        // Configurar número de recibo
        const reciboInput = document.getElementById('numero-recibo');
        reciboInput.value = this.ultimoNumeroRecibo + 1;

        this.cargarPrendasDisponibles('primaria');
        this.inicializarEventosFormulario();
    }

    cargarPrendasDisponibles(tipo) {
        const listaPrendas = document.getElementById('lista-prendas');
        const prendas = PRECIOS[tipo];
        
        listaPrendas.innerHTML = Object.entries(prendas).map(([prenda, tallas]) => `
            <div class="prenda-item">
                <div class="prenda-info">
                    <span class="nombre-prenda">${this.formatearNombrePrenda(prenda)}</span>
                    <select class="select-talla" data-prenda="${prenda}">
                        <option value="">Seleccionar talla</option>
                        ${Object.entries(tallas).map(([talla, precio]) => 
                            `<option value="${talla}">Talla ${talla} - $${precio.toLocaleString()}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="prenda-cantidad">
                    <button class="btn-cantidad" onclick="app.decrementarCantidad('${prenda}')">-</button>
                    <input type="number" min="0" value="0" class="input-cantidad" data-prenda="${prenda}">
                    <button class="btn-cantidad" onclick="app.incrementarCantidad('${prenda}')">+</button>
                </div>
            </div>
        `).join('');

        this.actualizarTotal();
    }

    formatearNombrePrenda(prenda) {
        const nombres = {
            sudadera: '👕 Sudadera',
            pantalonSudadera: '👖 Pantalón Sudadera',
            camisetaDeportiva: '👕 Camiseta Deportiva',
            jardinera: '👗 Jardinera',
            pantaloneta: '🩳 Pantaloneta'
        };
        return nombres[prenda] || prenda;
    }

    inicializarEventosFormulario() {
        // Eventos para tipo de uniforme
        document.querySelectorAll('input[name="tipo-uniforme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.cargarPrendasDisponibles(e.target.value);
            });
        });

        // Eventos para cambios en tallas y cantidades
        document.getElementById('lista-prendas').addEventListener('change', () => {
            this.actualizarTotal();
        });

        // Eventos para estado del pedido
        document.getElementById('estado-pedido').addEventListener('change', () => {
            this.actualizarSeccionAbono();
        });

        // Eventos para abono
        document.getElementById('abono').addEventListener('input', () => {
            this.actualizarSaldoPendiente();
        });
    }

    actualizarTotal() {
        let total = 0;
        const tipoUniforme = document.querySelector('input[name="tipo-uniforme"]:checked').value;
        
        document.querySelectorAll('.prenda-item').forEach(item => {
            const prenda = item.querySelector('.select-talla').dataset.prenda;
            const talla = item.querySelector('.select-talla').value;
            const cantidad = parseInt(item.querySelector('.input-cantidad').value) || 0;
            
            if (talla && cantidad > 0) {
                total += PRECIOS[tipoUniforme][prenda][talla] * cantidad;
            }
        });

        document.getElementById('total-monto').textContent = `$${total.toLocaleString()}`;
        this.actualizarSaldoPendiente();
    }

    actualizarSaldoPendiente() {
        const total = parseInt(document.getElementById('total-monto').textContent.replace(/[^0-9]/g, '')) || 0;
        const abono = parseInt(document.getElementById('abono').value) || 0;
        const saldoPendiente = total - abono;
        
        document.getElementById('saldo-pendiente').textContent = `$${saldoPendiente.toLocaleString()}`;
    }

    guardarPedido() {
        const pedido = this.recolectarDatosPedido();
        
        if (this.validarPedido(pedido)) {
            this.pedidos.push(pedido);
            this.ultimoNumeroRecibo = parseInt(pedido.numeroRecibo);
            this.guardarDatos();
            this.actualizarResumen();
            alert('Pedido guardado exitosamente');
            this.mostrarNuevoPedido();
        }
    }

    recolectarDatosPedido() {
        const prendasSeleccionadas = [];
        document.querySelectorAll('.prenda-item').forEach(item => {
            const prenda = item.querySelector('.select-talla').dataset.prenda;
            const talla = item.querySelector('.select-talla').value;
            const cantidad = parseInt(item.querySelector('.input-cantidad').value) || 0;
            
            if (talla && cantidad > 0) {
                prendasSeleccionadas.push({
                    tipo: prenda,
                    talla: talla,
                    cantidad: cantidad,
                    entregada: false
                });
            }
        });

        return {
            numeroRecibo: document.getElementById('numero-recibo').value,
            fecha: document.getElementById('fecha-pedido').value,
            cliente: document.getElementById('nombre-cliente').value,
            telefono: document.getElementById('telefono-cliente').value,
            tipoUniforme: document.querySelector('input[name="tipo-uniforme"]:checked').value,
            prendas: prendasSeleccionadas,
            total: parseInt(document.getElementById('total-monto').textContent.replace(/[^0-9]/g, '')),
            abono: parseInt(document.getElementById('abono').value) || 0,
            estado: document.getElementById('estado-pedido').value,
            prendasEntregadas: []
        };
    }

    validarPedido(pedido) {
        if (!pedido.cliente) {
            alert('Por favor ingrese el nombre del cliente');
            return false;
        }
        if (!pedido.telefono) {
            alert('Por favor ingrese el teléfono del cliente');
            return false;
        }
        if (pedido.prendas.length === 0) {
            alert('Por favor seleccione al menos una prenda');
            return false;
        }
        return true;
    }

    guardarDatos() {
        localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
        localStorage.setItem('ultimoNumeroRecibo', this.ultimoNumeroRecibo.toString());
    }

    incrementarCantidad(prenda) {
        const input = document.querySelector(`.input-cantidad[data-prenda="${prenda}"]`);
        input.value = (parseInt(input.value) || 0) + 1;
        this.actualizarTotal();
    }

    decrementarCantidad(prenda) {
        const input = document.querySelector(`.input-cantidad[data-prenda="${prenda}"]`);
        const valor = (parseInt(input.value) || 0) - 1;
        input.value = valor < 0 ? 0 : valor;
        this.actualizarTotal();
    }
}

// Inicializar la aplicación
const app = new UniformesApp();
