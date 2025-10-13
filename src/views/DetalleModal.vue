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
                    Seguimiento (Simulación)
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
                        <h4>Registrar Nuevo Seguimiento (Simulado)</h4>
                        <textarea placeholder="Escribe tu nota de seguimiento aquí..."></textarea>
                        <button class="btn-primary edit" disabled>Añadir Seguimiento</button>
                        <p class="simulation-note">⚠️ Este botón está deshabilitado. Es solo una simulación visual.</p>
                    </div>
                    
                    <div class="timeline">
                        <div v-for="(item, index) in seguimientoSimulado" :key="index" class="timeline-item">
                            <div class="timeline-dot" :class="`dot-${item.tipo.toLowerCase()}`"></div>
                            <div class="timeline-content">
                                <p class="timeline-title"><strong>{{ item.titulo }}</strong></p>
                                <p class="timeline-meta">{{ item.fecha }} por {{ item.usuario }}</p>
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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    incidencia: {
        type: Object,
        required: true
    }
});

defineEmits(['cerrar', 'editar']);

const formatFecha = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const estadoClass = (estadoTipo) => { 
    switch (estadoTipo) {
        case 'Abierta': return 'status-open';
        case 'En Proceso': return 'status-in-progress';
        case 'Cerrada': return 'status-closed';
        default: return 'status-default';
    }
};
const seguimientoSimulado = ref([
    {
        fecha: '12 Oct 2025, 14:30',
        usuario: 'Técnico Juan Pérez',
        tipo: 'Asignación',
        titulo: 'Incidencia Asignada',
        descripcion: 'La incidencia ha sido asignada al equipo de soporte de Nivel 1 para su revisión inicial.'
    },
    {
        fecha: '13 Oct 2025, 09:15',
        usuario: 'Técnico Juan Pérez',
        tipo: 'Nota',
        titulo: 'Análisis Inicial Completado',
        descripcion: 'Se realizó el análisis inicial. El problema parece estar relacionado con la configuración del servidor X. Se requiere elevar a Nivel 2.'
    },
    {
        fecha: '13 Oct 2025, 11:45',
        usuario: 'Sistema',
        tipo: 'Estado',
        titulo: 'Estado Actualizado a "En Proceso"',
        descripcion: 'El estado de la incidencia fue cambiado automáticamente a "En Proceso" tras el primer registro de actividad.'
    },
    {
        fecha: '13 Oct 2025, 14:00',
        usuario: 'Técnico Nivel 2 - Ana Gómez',
        tipo: 'Solución',
        titulo: 'Aplicación de Solución (Simulada)',
        descripcion: 'Se aplicó un parche de configuración. Se necesita verificar su impacto en las próximas 24 horas antes de cerrar. En este punto se adjunta un log de cambios.'
    }
]);
</script>
<style scoped>

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

/* Títulos H3 */
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
.btn-primary.edit { /* Editar */
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

.status-open,
.status-in-progress,
.status-closed {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
}

.status-open {
    color: #fb923c; 
    background-color: #fff7ed;
}

.status-in-progress {
    color: #3b82f6; 
    background-color: #eff6ff;
}

.status-closed {
    color: #10b981; 
    background-color: #ecfdf5;
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
