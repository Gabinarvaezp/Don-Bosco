class SistemaPedidos {
    constructor() {
        this.pedidos = [];
        this.ultimoNumeroRecibo = this.cargarUltimoNumeroRecibo();
    }

    cargarUltimoNumeroRecibo() {
        const ultimo = localStorage.getItem('ultimoNumeroRecibo');
        return ultimo ? parseInt(ultimo) : 0;
    }

    generarNuevoNumeroRecibo() {
        this.ultimoNumeroRecibo++;
        localStorage.setItem('ultimoNumeroRecibo', this.ultimoNumeroRecibo);
        return this.ultimoNumeroRecibo;
    }

    crearNuevoPedido(datos) {
        const pedido = {
            numeroRecibo: datos.numeroRecibo,
            fecha: new Date(),
            cliente: datos.cliente,
            telefono: datos.telefono,
            tipoUniforme: datos.tipoUniforme,
            prendas: datos.prendas,
            total: this.calcularTotal(datos.prendas),
            abono: datos.abono || 0,
            estado: 'PENDIENTE',
            fotoMedidas: datos.fotoMedidas,
            medidas: datos.medidas
        };

        this.pedidos.push(pedido);
        this.guardarPedidos();
        return pedido;
    }

    calcularTotal(prendas) {
        return prendas.reduce((total, prenda) => {
            const precio = PRECIOS[prenda.tipoUniforme][prenda.tipo][prenda.talla];
            return total + (precio * prenda.cantidad);
        }, 0);
    }

    guardarPedidos() {
        localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    }

    cargarPedidos() {
        const pedidosGuardados = localStorage.getItem('pedidos');
        if (pedidosGuardados) {
            this.pedidos = JSON.parse(pedidosGuardados);
        }
    }
}
