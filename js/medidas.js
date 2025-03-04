class GestorMedidas {
    constructor() {
        this.medidas = {};
    }

    mostrarFormularioMedidas(tipo) {
        const medidaTemplate = `
            <div class="formulario-medidas">
                <h3>📏 Medidas para ${tipo}</h3>
                ${this.obtenerCamposMedidas(tipo)}
                <div class="foto-medidas">
                    <label>📸 Foto de referencia:</label>
                    <input type="file" accept="image/*" id="foto-medidas" 
                           onchange="gestorMedidas.previsualizarFoto(event)">
                    <div id="preview-foto"></div>
                </div>
                <div class="observaciones">
                    <label>📝 Observaciones:</label>
                    <textarea id="observaciones-medidas" rows="3"></textarea>
                </div>
                <button onclick="gestorMedidas.guardarMedidas()" class="btn-principal">
                    💾 Guardar Medidas
                </button>
            </div>
        `;

        document.getElementById('medidas-container').innerHTML = medidaTemplate;
    }

    obtenerCamposMedidas(tipo) {
        const camposJardinera = {
            'largo': 'Largo total',
            'cintura': 'Cintura',
            'cadera': 'Cadera',
            'largo_falda': 'Largo de falda',
            'pecho': 'Contorno de pecho'
        };

        const camposBata = {
            'largo': 'Largo total',
            'hombros': 'Ancho de hombros',
            'pecho': 'Contorno de pecho',
            'manga': 'Largo de manga'
        };

        const campos = tipo === 'jardinera' ? camposJardinera : camposBata;

        return Object.entries(campos).map(([id, label]) => `
            <div class="campo-medida">
                <label>${label} (cm):</label>
                <input type="number" id="medida-${id}" min="0" step="0.5">
            </div>
        `).join('');
    }

    previsualizarFoto(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('preview-foto');
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    guardarMedidas() {
        const medidas = {};
        document.querySelectorAll('.campo-medida input').forEach(input => {
            const id = input.id.replace('medida-', '');
            medidas[id] = parseFloat(input.value) || 0;
        });

        medidas.observaciones = document.getElementById('observaciones-medidas').value;
        medidas.foto = document.getElementById('preview-foto').innerHTML;

        this.medidas[app.pedidoActual] = medidas;
        app.mostrarMensaje('✅ Medidas guardadas correctamente');
    }
}
