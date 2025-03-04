class UniformesApp {
    constructor() {
        this.pedidos = [];
        this.tipoUniformeActual = 'primaria';
        this.cargarPedidosGuardados();
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Eventos para los botones principales
        document.querySelectorAll('.btn-principal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const accion = e.target.getAttribute('data-accion');
                if (accion) this[accion]();
            });
        });

        // Eventos para selector de uniforme
        document.querySelectorAll('.opcion-uniforme').forEach(opcion => {
            opcion.addEventListener('click', (e) => {
                this.cambiarTipoUniforme(e.target);
            });
        });

        // Eventos para opciones de pago
        document.querySelectorAll('.opcion-pago').forEach(opcion => {
            opcion.addEventListener('click', (e) => {
                this.seleccionarFormaPago(e.target);
            });
        });
    }

    mostrarNuevoPedido() {
        const main = document.querySelector('main');
        main.innerHTML = this.generarFormularioNuevoPedido();
        this.actualizarListaPrendas();
    }

    generarFormularioNuevoPedido() {
        return `
            <div class="formulario-pedido">
                <h2>📝 Nuevo Pedido</h2>
                
                <div class="campo-formulario">
                    <label>N° Recibo:</label>
                    <input type="number" class="input-grande" value="${this.generarNumeroRecibo()}" readonly>
                </div>

                <div class="campo-formulario">
                    <label>Nombre Cliente:</label>
                    <input type="text" class="input-grande" placeholder="Nombre completo" required>
                </div>

                <div class="campo-formulario">
                    <label>Teléfono:</label>
                    <input type="tel" class="input-grande" placeholder="Número de teléfono" required>
                </div>

                <div class="selector-uniforme">
                    <div class="opcion-uniforme activo" data-tipo="primaria">
                        👕 Primaria
                    </div>
                    <div class="opcion-uniforme" data-tipo="bachillerato">
                        👔 Bachillerato
                    </div>
                </div>

                <div class="lista-prendas"></div>

                <div class="campo-formulario">
                    <label>💰 Abono:</label>
                    <input type="number" class="input-grande" value="0" min="0">
                </div>

                <h3>💳 Forma de Pago</h3>
                <div class="opciones-pago">
                    <div class="opcion-pago" data-pago="efectivo">
                        💵 Efectivo
                    </div>
                    <div class="opcion-pago" data-pago="nequi">
                        📱 Nequi
                    </div>
                    <div class="opcion-pago" data-pago="daviplata">
                        💳 Daviplata
                    </div>
                </div>

                <button class="btn-principal" onclick="app.guardarPedido()">
                    💾 Guardar Pedido
                </button>
            </div>
        `;
    }

    actualizarListaPrendas() {
        const listaPrendas = document.querySelector('.lista-prendas');
        const prendas = PRECIOS[this.tipoUniformeActual];
        
        listaPrendas.innerHTML = Object.entries(prendas).map(([prenda, tallas]) => `
            <div class="prenda-item">
                <div class="prenda-info">
                    <h4>${this.formatearNombrePrenda(prenda)}</h4>
                    <select class="select-talla">
                        ${Object.entries(tallas).map(([talla, precio]) => `
                            <option value="${talla}">${talla} - $${precio.toLocaleString()}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="prenda-cantidad">
                    <button onclick="app.decrementarCantidad('${prenda}')">-</button>
                    <input type="number" value="0" min="0" class="cantidad-${prenda}">
                    <button onclick="app.incrementarCantidad('${prenda}')">+</button>
                </div>
            </div>
        `).join('');
    }

    formatearNombrePrenda(prenda) {
        const nombres = {
            sudadera: '👕 Sudadera',
            pantalonSudadera: '👖 Pantalón Sudadera',
            camisetaDeportiva: '👕 Camiseta Deportiva',
            jardinera: '👗 Jardinera'
        };
        return nombres[prenda] || prenda;
    }

    cambiarTipoUniforme(elemento) {
        document.querySelectorAll('.opcion-uniforme').forEach(op => op.classList.remove('activo'));
        elemento.classList.add('activo');
        this.tipoUniformeActual = elemento.getAttribute('data-tipo');
        this.actualizarListaPrendas();
    }

    guardarPedido() {
        const pedido = {
            numeroRecibo: document.querySelector('input[type="number"]').value,
            cliente: document.querySelector('input[placeholder="Nombre completo"]').value,
            telefono: document.querySelector('input[placeholder="Número de teléfono"]').value,
            tipoUniforme: this.tipoUniformeActual,
            prendas: this.obtenerPrendasSeleccionadas(),
            abono: parseFloat(document.querySelector('input[type="number"][min="0"]').value),
            formaPago: document.querySelector('.opcion-pago.activo')?.getAttribute('data-pago') || 'efectivo',
            fecha: new Date(),
            estado: 'pendiente'
        };

        if (this.validarPedido(pedido)) {
            this.pedidos.push(pedido);
            this.guardarPedidosLocal();
            this.mostrarMensaje('✅ Pedido guardado correctamente');
            this.mostrarNuevoPedido();
        }
    }

    validarPedido(pedido) {
        if (!pedido.cliente) {
            this.mostrarMensaje('⚠️ Por favor ingrese el nombre del cliente');
            return false;
        }
        if (!pedido.telefono) {
            this.mostrarMensaje('⚠️ Por favor ingrese el teléfono del cliente');
            return false;
        }
        if (pedido.prendas.length === 0) {
            this.mostrarMensaje('⚠️ Por favor seleccione al menos una prenda');
            return false;
        }
        return true;
    }

    mostrarMensaje(mensaje) {
        const div = document.createElement('div');
        div.className = 'mensaje';
        div.textContent = mensaje;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    // ... más métodos
}

// Inicializar la aplicación
const app = new UniformesApp();
