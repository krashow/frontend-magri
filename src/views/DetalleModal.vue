<template>
    <div class="modal-overlay" @click.self="$emit('cerrar')">
        <div class="modal-content">
            <h2>Detalle de Incidencia #{{ incidencia.id }}</h2>
            <button class="close-btn" @click="$emit('cerrar')">&times;</button>

            <div class="tabs-nav">
                <button 
                    :class="{ 'active': activeTab === 'vista' }" 
                    @click="activeTab = 'vista'"
                >
                    Vista General
                </button>
                <button 
                    :class="{ 'active': activeTab === 'seguimiento' }" 
                    @click="activeTab = 'seguimiento'"
                >
                    Seguimiento
                </button>
            </div>

            <div class="modal-body">
                <div v-show="activeTab === 'vista'" class="tab-content">
                    <div class="data-group">
                        <p><strong>Código:</strong> {{ incidencia.codigoReferencia }}</p>
                        <p><strong>Fecha de Registro:</strong> {{ formatFecha(incidencia.fechaRegistro) }}</p>
                        <p><strong>Estado:</strong> <span :class="estadoClass(incidencia.estado.tipo)">{{ incidencia.estado.tipo }}</span></p>
                        <p><strong>Prioridad:</strong> {{ incidencia.prioridad ? incidencia.prioridad.nombre : 'S/I' }}</p>
                    </div>
                    
                    <h3>Referencia</h3>
                    <div class="data-group">
                        <p><strong>Usuario:</strong> {{ incidencia.usuario ? incidencia.usuario.nombre : 'S/I' }}</p>
                        <p><strong>Área:</strong> {{ incidencia.area ? incidencia.area.nombre : 'S/I' }}</p>
                        <p><strong>Categoría:</strong> {{ incidencia.categoria ? incidencia.categoria.nombre : 'S/I' }}</p>
                    </div>

                    <h3>Detalle y Observaciones</h3>
                    <div class="description-box">
                        <h4>Descripción (Respuestas del formulario):</h4>
                        <pre>{{ incidencia.dscInc }}</pre> 
                        
                        <h4>Observación del Usuario:</h4>
                        <p>{{ incidencia.obsInc || 'No se proporcionaron observaciones adicionales.' }}</p>
                    </div>
                </div>

                <div v-show="activeTab === 'seguimiento'" class="tab-content">
                    <h3>Registro de Actividad y Seguimiento</h3>
                    
                    <div class="new-tracking-form">
                        <h4>Añadir Seguimiento y/o Cambiar Estado</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fechaSeguimiento">Fecha y Hora:</label>
                                <input type="datetime-local" id="fechaSeguimiento" v-model="newSeguimiento.fecha">
                            </div>

                            <div class="form-group">
                                <label for="estadoSeguimiento">Nuevo Estado:</label>
                                <select id="estadoSeguimiento" v-model="newSeguimiento.nuevoEstado">
                                    <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">{{ estado }}</option>
                                </select>
                            </div>
                        </div>

                        <label for="descSeguimiento">Nota de Seguimiento (Obligatoria):</label>
                        <textarea 
                            id="descSeguimiento"
                            placeholder="Describe el avance, la acción realizada, o la razón del cambio de estado." 
                            v-model="newSeguimiento.descripcion"
                        ></textarea>
                        
                        <button 
                            @click="agregarSeguimientoSimulado" 
                            class="btn-primary edit"
                        >
                            Registrar Seguimiento
                        </button>
                        <p class="simulation-note">✅ Esta acción es una; actualiza el modal y el estado de la incidencia en memoria.</p>
                    </div>
                    
                    <div class="timeline">
                        <div v-for="(item, index) in seguimientoSimulado" :key="index" class="timeline-item">
                            <div class="timeline-dot" :class="`dot-${item.tipo.toLowerCase().replace(' ', '-')}`"></div>
                            <div class="timeline-content">
                                <p class="timeline-title"><strong>{{ item.titulo }}</strong></p>
                                <p class="timeline-meta">{{ item.fecha }} por **{{ item.usuario }}**</p>
                                <div class="timeline-description">{{ item.descripcion }}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="action-buttons modal-footer">
                <button @click="$emit('cerrar')" class="btn-secondary back">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
    incidencia: {
        type: Object,
        required: true
    }
});

defineEmits(['cerrar', 'editar']);

// Estado para controlar la pestaña activa (Por defecto: 'vista')
const activeTab = ref('vista');

// Lista de posibles estados para el select (simulación)
const estadosDisponibles = ref([
    'Abierta',
    'En Proceso',
    'Pendiente de Usuario',
    'Resuelta (Verificación)',
    'Cerrada'
]);

// 1. Estado Reactivo para el nuevo seguimiento
const newSeguimiento = ref({
    descripcion: '',
    fecha: new Date().toISOString().substring(0, 16), // Formato yyyy-MM-ddThh:mm
    // Inicializar con el estado actual de la incidencia
    nuevoEstado: props.incidencia.estado.tipo 
});

// 2. Datos de Seguimiento Simulados Iniciales
const seguimientoSimulado = ref([
    {
        fecha: '12/10/2025, 14:30',
        usuario: 'Administrador',
        tipo: 'Incidencia',
        titulo: 'Incidencia creada',
        descripcion: 'Incidencia creada el 10 de octubre de 2025 a las 14:30., en el area de sistemas'
    },
    {
        fecha: '13/10/2025, 09:15',
        usuario: 'Administrador',
        tipo: 'Nota',
        titulo: 'Análisis Inicial Completado',
        descripcion: 'Se realizó el análisis inicial. Se requiere validar un problema de configuración.'
    }
]);

// 3. Función para añadir el seguimiento y actualizar el estado (Simulación)
const agregarSeguimientoSimulado = () => {
    // Validación mínima
    if (!newSeguimiento.value.descripcion) {
        alert("La nota de seguimiento es obligatoria para registrar una actividad.");
        return;
    }
    
    const fechaFormateada = formatFechaInput(newSeguimiento.value.fecha);

    // A. Agregar el nuevo seguimiento como "Nota" a la línea de tiempo
    const nuevoRegistro = {
        fecha: fechaFormateada,
        usuario: 'Usuario Actual (Simulado)',
        tipo: 'Nota',
        titulo: 'Nueva Nota de Seguimiento',
        descripcion: newSeguimiento.value.descripcion
    };
    seguimientoSimulado.value.push(nuevoRegistro);

    // B. Si el estado fue cambiado, registrarlo y actualizar la incidencia
    if (newSeguimiento.value.nuevoEstado !== props.incidencia.estado.tipo) {
        const estadoAnterior = props.incidencia.estado.tipo;
        
        // Actualizar el estado de la incidencia VISUALMENTE
        props.incidencia.estado.tipo = newSeguimiento.value.nuevoEstado;

        // Añadir registro de cambio de estado
        seguimientoSimulado.value.push({
            fecha: fechaFormateada,
            usuario: 'Sistema/Usuario Actual',
            tipo: 'Estado',
            titulo: `Estado actualizado a "${props.incidencia.estado.tipo}"`,
            descripcion: `Cambio de estado de "${estadoAnterior}" a "${props.incidencia.estado.tipo}" registrado.`
        });
    }

    // C. Ordenar la línea de tiempo (se asume que la fecha de 'datetime-local' es ordenable como string)
    seguimientoSimulado.value.sort((a, b) => (a.fecha > b.fecha) ? 1 : -1);

    // D. Resetear el formulario
    newSeguimiento.value.descripcion = '';
    newSeguimiento.value.fecha = new Date().toISOString().substring(0, 16);
    // Asegurarse de que el selector muestre el estado actual de la incidencia
    newSeguimiento.value.nuevoEstado = props.incidencia.estado.tipo; 
};


// Funciones de formato existentes
const formatFecha = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

// Función auxiliar para formatear la fecha del input para la visualización del timeline
const formatFechaInput = (dateTimeInput) => {
    if (!dateTimeInput) return 'N/A';
    const [datePart, timePart] = dateTimeInput.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}, ${timePart}`;
};

const estadoClass = (estadoTipo) => { 
    switch (estadoTipo) {
        case 'Abierta': return 'status-open';
        case 'En Proceso': 
        case 'Resuelta (Verificación)': return 'status-in-progress';
        case 'Pendiente de Usuario': return 'status-default'; // Usamos 'default' para pendiente
        case 'Cerrada': return 'status-closed';
        default: return 'status-default';
    }
};
</script>

<style scoped>
/* ---------------------------------------------------------------------- */
/* ESTILOS DE ESTRUCTURA Y BASE (Originales) */
/* ---------------------------------------------------------------------- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999; 
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px); 
    animation: fadeIn 0.3s ease-out;
}

.modal-content { 
    background: #ffffff;
    border-radius: 16px; 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 1px solid #e2e8f0;
    animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding: 0; 
}

.modal-content h2 { 
    font-size: 22px;
    color: #1e293b; 
    font-weight: 700;
    margin: 0;
    padding: 24px 32px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}
.close-btn { 
    position: absolute; 
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s ease;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
}

.close-btn:hover {
    color: #ef4444; 
    background: #fee2e2;
}
.modal-body {
    padding: 32px; 
}
.data-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px 32px;
    margin-bottom: 32px;
    padding: 20px;
    background: #f8fafc; 
    border-radius: 10px;
    border: 1px solid #e2e8f0;
}

.data-group p {
    margin: 0;
    font-size: 15px;
    color: #475569;
}

.data-group strong {
    color: #1e293b;
    font-weight: 600;
}

/* Títulos H3 y H4 */
.modal-body h3 {
    font-size: 20px;
    color: #3b82f6; 
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
}
.modal-body h4 {
    font-size: 16px;
    color: #475569;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 10px;
}
.description-box {
    padding: 24px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
}

.description-box pre {
    white-space: pre-wrap; 
    font-size: 14px;
    color: #1e293b;
    line-height: 1.6;
    margin: 0;
    padding: 15px;
    background-color: #f1f5f9; 
    border-radius: 8px;
}

.description-box p {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin: 0;
}
.modal-footer {
    padding: 20px 32px;
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.btn-primary.edit { 
    background: #6366f1; 
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}
.btn-primary.edit:hover {
    background: #4f46e5;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-secondary.back {
    background: #e2e8f0; 
    color: #475569;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #cbd5e1;
}

.btn-secondary.back:hover {
    background: #cbd5e1;
}

/* Estilos de Estado */
.status-open,
.status-in-progress,
.status-closed,
.status-default { 
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
}

.status-open {
    color: #fb923c; /* Abierta */
    background-color: #fff7ed;
}

.status-in-progress {
    color: #3b82f6; /* En Proceso / Verificación */
    background-color: #eff6ff;
}

.status-closed {
    color: #10b981; /* Cerrada */
    background-color: #ecfdf5;
}

.status-default { 
    color: #7c3aed; /* Pendiente de Usuario */
    background-color: #f5f3ff;
}

/* ---------------------------------------------------------------------- */
/* ESTILOS DE PESTAÑAS */
/* ---------------------------------------------------------------------- */
.tabs-nav {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    padding: 0 32px; 
    background-color: #ffffff; 
}

.tabs-nav button {
    background: none;
    border: none;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 500;
    color: #64748b; 
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px; 
    outline: none; 
}

.tabs-nav button:hover:not(.active) {
    color: #3b82f6;
    background-color: #f1f5f9;
}

.tabs-nav button.active {
    color: #3b82f6; 
    font-weight: 600;
    border-bottom: 3px solid #3b82f6; 
}

/* ---------------------------------------------------------------------- */
/* ESTILOS DEL FORMULARIO DE SEGUIMIENTO INTERACTIVO */
/* ---------------------------------------------------------------------- */
.new-tracking-form {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 32px;
}

.new-tracking-form label {
    display: block;
    font-weight: 600;
    color: #1e293b;
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 15px;
}
.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
}
.form-group {
    flex: 1;
}

.new-tracking-form input[type="datetime-local"],
.new-tracking-form select {
    width: 100%;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #ffffff;
}

.new-tracking-form textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    margin-bottom: 15px;
    resize: vertical;
    font-size: 14px;
    box-sizing: border-box;
}

.simulation-note {
    font-size: 13px;
    color: #34d399; 
    margin-top: 10px;
    font-style: italic;
    border-top: 1px dashed #e2e8f0;
    padding-top: 8px;
}

/* ---------------------------------------------------------------------- */
/* ESTILOS DE LÍNEA DE TIEMPO */
/* ---------------------------------------------------------------------- */

.timeline {
    position: relative;
    padding-left: 30px; 
    border-left: 2px solid #e2e8f0; 
    margin-top: 20px;
}

.timeline-item {
    margin-bottom: 30px;
    position: relative;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.timeline-dot {
    position: absolute;
    left: -40px; 
    top: 18px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid #ffffff; 
}

/* Colores para los tipos de seguimiento */
.dot-asignación {
    background-color: #3b82f6; /* Azul */
    box-shadow: 0 0 0 2px #3b82f6;
}
.dot-nota {
    background-color: #fb923c; /* Naranja */
    box-shadow: 0 0 0 2px #fb923c;
}
.dot-estado { 
    background-color: #10b981; /* Verde (Cambio de Estado) */
    box-shadow: 0 0 0 2px #10b981;
}
.dot-solución {
    background-color: #6366f1; /* Morado */
    box-shadow: 0 0 0 2px #6366f1;
}

.timeline-title {
    margin: 0 0 5px 0;
    font-size: 17px;
    color: #1e293b;
}

.timeline-meta {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 10px;
}

.timeline-description {
    font-size: 15px;
    color: #475569;
    line-height: 1.5;
}

/* Animaciones */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(-20px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
}
</style>