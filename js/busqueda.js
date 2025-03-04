class SistemaReportes {
    constructor() {
        this.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    }

    mostrarReportes() {
        const reportesHTML = `
            <div class="reportes-container">
                <h2>📊 Reportes y Estadísticas</h2>
                <div class="grid-reportes">
                    <div class="reporte-card">
                        <h3>📅 Ventas del Día</h3>
                        <div class="reporte-contenido">
                            <p class="total-ventas">$${this.calcularVentasDelDia().toLocaleString()}</p>
                            <p class="subtitulo">Total de hoy</p>
                        </div>
                    </div>
                    <div class="reporte-card">
                        <h3>📊 Ventas del Mes</h3>
                        <div class="reporte-contenido">
                            <p class="total-ventas">$${this.calcularVentasDelMes().toLocaleString()}</p>
                            <p class="subtitulo">${this.meses[new Date().getMonth()]}</p>
                        </div>
                    </div>
                    <div class="reporte-card">
                        <h3>💰 Abonos Pendientes</h3>
                        <div class="reporte-contenido">
                            <p class="total-ventas">$${this.calcularAbonosPendientes().toLocaleString()}</p>
                            <p class="subtitulo">Por cobrar</p>
                        </div>
                    </div>
                    <div class="reporte-card">
                        <h3>📦 Prendas por Entregar</h3>
                        <div class="reporte-contenido">
                            <p class="total-ventas">${this.contarPrendasPendientes()}</p>
                            <p class="subtitulo">Pendientes</p>
                        </div>
                    </div>
                </div>
                <div class="acciones-reportes">
                    <button onclick="app.exportarExcel()" class="btn-accion">
                        📊 Exportar a Excel
                    </button>
                    <button onclick="app.exportarPDF()" class="btn-accion">
                        📄 Exportar a PDF
                    </button>
                    <button onclick="app.enviarWhatsApp()" class="btn-accion">
                        📱 Enviar por WhatsApp
                    </button>
                </div>
            </div>
        `;

        document.querySelector('#contenido-principal').innerHTML = reportesHTML;
    }

    calcularVentasDelDia() {
        const hoy = new Date().toDateString();
        return app.pedidos
            .filter(p => new Date(p.fecha).toDateString() === hoy)
            .reduce((total, p) => total + p.total, 0);
    }

    calcularVentasDelMes() {
        const ahora = new Date();
        return app.pedidos
            .filter(p => {
                const fechaPedido = new Date(p.fecha);
                return fechaPedido.getMonth() === ahora.getMonth() &&
                       fechaPedido.getFullYear() === ahora.getFullYear();
            })
            .reduce((total, p) => total + p.total, 0);
    }

    calcularAbonosPendientes() {
        return app.pedidos
            .filter(p => p.estado === 'pendiente')
            .reduce((total, p) => total + (p.total - p.abono), 0);
    }

    contarPrendasPendientes() {
        return app.pedidos
            .filter(p => p.estado === 'pendiente')
            .reduce((total, p) => total + p.prendas.length, 0);
    }
}
