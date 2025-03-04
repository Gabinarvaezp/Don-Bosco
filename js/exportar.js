class SistemaExportacion {
    exportarExcel() {
        const data = this.prepararDatosExcel();
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
        XLSX.writeFile(workbook, `Pedidos_${new Date().toLocaleDateString()}.xlsx`);
    }

    prepararDatosExcel() {
        return app.pedidos.map(p => ({
            'Número Recibo': p.numeroRecibo,
            'Fecha': new Date(p.fecha).toLocaleDateString(),
            'Cliente': p.cliente,
            'Teléfono': p.telefono,
            'Tipo': p.tipoUniforme,
            'Total': p.total,
            'Abono': p.abono,
            'Pendiente': p.total - p.abono,
            'Estado': p.estado,
            'Prendas': p.prendas.map(prenda => 
                `${prenda.tipo} (${prenda.talla}) x${prenda.cantidad}`
            ).join(', '),
            'Medidas': p.medidas || 'N/A'
        }));
    }

    exportarPDF() {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('Uniformes Don Bosco', 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text(`Reporte de Pedidos - ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

        const data = this.prepararDatosPDF();
        doc.autoTable({
            head: [['Recibo', 'Cliente', 'Total', 'Estado']],
            body: data,
            startY: 40,
            styles: { fontSize: 12 },
            headStyles: { fillColor: [255, 105, 180] }
        });

        doc.save(`Pedidos_${new Date().toLocaleDateString()}.pdf`);
    }

    prepararDatosPDF() {
        return app.pedidos.map(p => [
            p.numeroRecibo,
            p.cliente,
            `$${p.total.toLocaleString()}`,
            p.estado.toUpperCase()
        ]);
    }

    compartirWhatsApp(pedido) {
        const mensaje = this.generarMensajePedido(pedido);
        const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }

    generarMensajePedido(pedido) {
        return `🎽 *UNIFORMES DON BOSCO*
📝 Pedido #${pedido.numeroRecibo}
👤 Cliente: ${pedido.cliente}
📅 Fecha: ${new Date(pedido.fecha).toLocaleDateString()}
💰 Total: $${pedido.total.toLocaleString()}
💵 Abono: $${pedido.abono.toLocaleString()}
🏷️ Pendiente: $${(pedido.total - pedido.abono).toLocaleString()}

*Prendas:*
${pedido.prendas.map(p => `- ${p.tipo} (${p.talla}) x${p.cantidad}`).join('\n')}`;
    }
}
