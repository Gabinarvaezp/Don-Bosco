function exportarAPDF() {
    const pedidos = sistemaPedidos.pedidos;
    let contenido = "Número de Recibo, Fecha, Cliente, Teléfono, Total, Estado\n";

    pedidos.forEach(pedido => {
        contenido += `${pedido.numeroRecibo}, ${pedido.fecha.toLocaleDateString()}, ${pedido.cliente}, ${pedido.telefono}, ${pedido.total}, ${pedido.estado}\n`;
    });

    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.csv';
    a.click();
    URL.revokeObjectURL(url);
}
