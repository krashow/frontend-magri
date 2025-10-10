<template>
<div v-if="isOpen" class="modal-overlay">
    <div class="modal-content gestion-modal">
        <div class="modal-header">
            <h3>Gestión de Incidencia #{{ incidencia.id }}</h3>
            <button @click="$emit('close')" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
            <h4 class="incidencia-title">{{ incidencia.titulo }}</h4>
            
            <div class="details-section">
                <p><strong>Estado Actual:</strong> 
                    <span :class="['estado-badge', getEstadoClass(incidencia.estado?.nombre)]">
                        {{ incidencia.estado?.nombre || 'N/A' }}
                    </span>
                </p>
                <p><strong>Descripción:</strong> {{ incidencia.descripcion }}</p>
                <p><strong>Registrada el:</strong> {{ formatDate(incidencia.fechaRegistro) }}</p>
            </div>

            <hr>

            <form @submit.prevent="$emit('save')">
                
                <div class="form-group">
                    <label for="seguimiento">Registro de Tareas / Seguimiento</label>
                    <textarea id="seguimiento" rows="4" v-model="gestionData.seguimiento" required placeholder="Describe las acciones tomadas o el progreso."></textarea>
                </div>

                <div class="form-group status-group">
                    <label for="nuevoEstado">Cambiar Estado a:</label>
                    <select id="nuevoEstado" v-model="gestionData.nuevoEstado" required>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Abierto">Reabrir / Abierto</option>
                    </select>
                </div>

                <div class="form-group" v-if="gestionData.nuevoEstado === 'Cerrado' || gestionData.nuevoEstado === 'Resuelto'">
                    <label for="fechaCierre">Fecha de Cierre (Automático)</label>
                    <input type="date" id="fechaCierre" :value="gestionData.fechaCierre" disabled>
                </div>

                <div class="form-actions">
                    <button type="button" class="cancel-btn" @click="$emit('close')">Cancelar</button>
                    <button type="submit" class="submit-btn">Guardar Seguimiento</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean,
    incidencia: Object,
    gestionData: Object, 
    getEstadoClass: Function,
    formatDate: Function
});
const emit = defineEmits(['close', 'save']);
</script>

<style scoped>
/* --- ESTILOS DEL MODAL DE GESTIÓN --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

.incidencia-title {
    font-size: 18px;
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 15px;
}

.details-section p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
}

.estado-badge {
    /* Estilos copiados de Notificaciones.vue para que se vean bien */
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

/* Clases de estado copiadas para el modal */
.estado-rojo { background-color: #ffe0e0; color: #cc0000; }
.estado-amarillo { background-color: #fffacd; color: #b8860b; }
.estado-verde { background-color: #e0fff0; color: #008000; }
.estado-gris { background-color: #eee; color: #555; }


.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.form-group textarea, .form-group select, .form-group input[type="date"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
}

.form-group input[type="date"]:disabled {
    background-color: #eee;
    color: #555;
    cursor: not-allowed;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 20px 0;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
}

.submit-btn, .cancel-btn {
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.submit-btn {
    background-color: #4CAF50; /* Verde */
    color: white;
    border: none;
}

.submit-btn:hover {
    background-color: #45a049;
}

.cancel-btn {
    background-color: #ccc;
    color: #333;
    border: none;
}

.cancel-btn:hover {
    background-color: #bbb;
}
</style>