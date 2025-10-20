<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal-content">
      <header class="modal-header">
        <h2>Detalle de Incidencia #{{ incidencia.id }}</h2>
        <button class="close-btn" @click="$emit('cerrar')">&times;</button>
      </header>

      <div class="tabs-nav">
        <button
          :class="{ active: activeTab === 'vista' }"
          @click="activeTab = 'vista'"
        >
          Vista General
        </button>
        <button
          :class="{ active: activeTab === 'seguimiento' }"
          @click="activeTab = 'seguimiento'"
        >
          Seguimiento
        </button>
      </div>

      <div class="modal-body">
        <div v-show="activeTab === 'vista'" class="tab-content">
          <section class="info-section">
            <h3>Información Principal</h3>
            <div class="data-group">
              <p>
                <strong>Código:</strong> <span>{{ incidencia.codigoReferencia }}</span>
              </p>
              <p>
                <strong>Fecha de Registro:</strong>
                <span>{{ formatFecha(incidencia.fechaRegistro) }}</span>
              </p>
              <p>
                <strong>Estado:</strong>
                <span :class="['status-badge', estadoClass(incidencia.estado.tipo)]">{{
                  incidencia.estado.tipo
                }}</span>
              </p>
              <p>
                <strong>Prioridad:</strong>
                <span>{{ incidencia.prioridad ? incidencia.prioridad.nombre : "S/I" }}</span>
              </p>
              <p class="full-row sla-status">
                <strong>Fecha de Compromiso (SLA):</strong>
                <span :class="slaClass(incidencia.fechaSLA)">{{ 
                    incidencia.fechaSLA ? formatFecha(incidencia.fechaSLA) : "No establecido" 
                }}</span>
              </p>
            </div>
          </section>

          <section class="info-section">
            <h3>Referencia</h3>
            <div class="data-group">
              <p>
                <strong>Usuario:</strong>
                <span>{{ incidencia.usuario ? incidencia.usuario.nombre : "S/I" }}</span>
              </p>
              <p>
                <strong>Área:</strong>
                <span>{{ incidencia.area ? incidencia.area.nombre : "S/I" }}</span>
              </p>
              <p>
                <strong>Categoría:</strong>
                <span>{{ incidencia.categoria ? incidencia.categoria.nombre : "S/I" }}</span>
              </p>
            </div>
          </section>

          <section class="info-section detail-box">
            <h3>Detalle y Observaciones</h3>
            <div class="description-box">
              <h4>Descripción (Respuestas del formulario):</h4>
              <pre>{{ incidencia.dscInc }}</pre>

              <h4>Observación del Usuario:</h4>
              <p>
                {{
                  incidencia.obsInc ||
                  "No se proporcionaron observaciones adicionales."
                }}
              </p>
            </div>
          </section>
        </div>

        <div v-show="activeTab === 'seguimiento'" class="tab-content">
          <section class="new-tracking-form">
            <h4>Añadir Seguimiento y/o Cambiar Estado</h4>

            <div class="form-row">
              <div class="form-group">
                <label for="fechaSeguimiento">Fecha y Hora de la Acción</label>
                <input
                  type="datetime-local"
                  id="fechaSeguimiento"
                  v-model="newSeguimiento.fecha"
                />
              </div>

              <div class="form-group">
                <label for="estadoSeguimiento">Nuevo Estado</label>
                <select
                  id="estadoSeguimiento"
                  v-model="newSeguimiento.nuevoEstado"
                >
                  <option
                    v-for="estado in estadosDisponibles"
                    :key="estado"
                    :value="estado"
                  >
                    {{ estado }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="fechaCompromiso">Fecha de Compromiso (SLA)</label>
                <input
                  type="date"
                  id="fechaCompromiso"
                  v-model="newSeguimiento.fechaCompromiso"
                />
              </div>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex: 1;">
                    <label for="tipoSeguimiento">Tipo de Seguimiento</label>
                    <select id="tipoSeguimiento" v-model="newSeguimiento.tipo">
                        <option value="Nota">Nota</option>
                        <option value="Escalamiento">Escalamiento</option>
                        <option value="Solución Aplicada">Solución Aplicada</option>
                        <option value="Requerimiento Info">Requerimiento de Información</option>
                    </select>
                </div>
                
                <div class="form-group" style="max-width: 250px;">
                    <label for="tiempoInvertido">Tiempo Estimado</label>
                    <input
                      type="text"
                      id="tiempoInvertido"
                      placeholder="Ej: 1h 30m o 45m"
                      v-model="newSeguimiento.tiempoInvertido"
                    />
                </div>
            </div>
            
            <div class="form-group">
              <label>Responsables Involucrados (Opcional)</label>
              <div class="input-with-button">
                <select v-model="selectedResponsable" class="flex-grow">
                  <option disabled value="">Selecciona un usuario</option>
                  <option
                    v-for="usuario in usuariosDisponibles"
                    :key="usuario"
                    :value="usuario"
                    :disabled="newSeguimiento.responsablesInvolucrados.includes(usuario)"
                  >
                    {{ usuario }}
                  </option>
                </select>
                <button
                  @click="addResponsable"
                  :disabled="!selectedResponsable"
                  class="btn-icon add-resp"
                  title="Añadir responsable"
                >
                  +
                </button>
              </div>
              <div v-if="newSeguimiento.responsablesInvolucrados.length" class="tags-container">
                <span
                  v-for="resp in newSeguimiento.responsablesInvolucrados"
                  :key="resp"
                  class="tag"
                >
                  {{ resp }}
                  <button @click="removeResponsable(resp)" class="tag-close">&times;</button>
                </span>
              </div>
            </div>

            <label for="descSeguimiento"
              >Nota de Seguimiento (Obligatoria)</label
            >
            <textarea
              id="descSeguimiento"
              placeholder="Describe el avance, la acción realizada, o la razón del cambio de estado."
              v-model="newSeguimiento.descripcion"
            ></textarea>

            <div class="form-group">
              <label for="adjuntoSeguimiento">Adjuntar Archivo</label>
              <input
                type="file"
                id="adjuntoSeguimiento"
                @change="handleFileUpload"
              />
              <small v-if="newSeguimiento.nombreAdjunto" class="form-text"
                >Archivo seleccionado:
                <strong>{{ newSeguimiento.nombreAdjunto }}</strong></small
              >
              <small v-else class="form-text"
                >Ningún archivo seleccionado.</small
              >
            </div>

            <button 
                @click="notificarUsuario" 
                class="btn-secondary notify" 
                :disabled="!newSeguimiento.descripcion"
                style="margin-right: 10px;"
            >
              <i class="fas fa-paper-plane"></i> Notificar al Usuario
            </button>
            
            <button
              @click="agregarSeguimientoSimulado"
              class="btn-primary edit"
            >
              Registrar Seguimiento
            </button>
          </section>
          
          <hr style="margin-top: 32px;" />

          <section class="tracking-log">
            <h3>Historial de Seguimiento</h3>
            <div class="tracking-table-container">
              <table class="tracking-table">
                <thead>
                  <tr>
                    <th style="width: 100px;">Fecha</th>
                    <th style="width: 80px;">Tipo</th>
                    <th style="width: 150px;">Título/Estado</th>
                    <th style="width: 100px;">Usuario</th>
                    <th style="width: 80px;">Tiempo</th> <th style="width: 180px;">Involucrados</th>
                    <th style="width: 150px;">Adjuntos</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in seguimientoSimulado"
                    :key="index"
                    :class="`row-${item.tipo.toLowerCase().replace(' ', '-')}`"
                  >
                    <td>{{ item.fecha }}</td>
                    <td>
                      <span :class="['tipo-badge', `badge-${item.tipo.toLowerCase().replace(' ', '-')}`]">
                        {{ item.tipo }}
                      </span>
                    </td>
                    <td><strong>{{ item.titulo }}</strong></td>
                    <td>{{ item.usuario }}</td>
                    <td>{{ item.tiempo || 'N/A' }}</td> <td>
                      <span v-if="item.involucrados && item.involucrados.length">
                        {{ item.involucrados.join(", ") }}
                      </span>
                      <span v-else>N/A</span>
                    </td>
                    <td>
                      <span v-if="item.adjuntoNombre" class="adjunto-tag">
                        📎 {{ item.adjuntoNombre }}
                      </span>
                      <span v-else>N/A</span>
                    </td>
                    <td>{{ item.descripcion }}</td>
                  </tr>
                  <tr v-if="seguimientoSimulado.length === 0">
                    <td colspan="8" class="no-tracking-message"> Aún no hay registros de seguimiento para esta incidencia.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <footer class="action-buttons modal-footer">
        <button 
          v-if="incidencia.estado.tipo === 'En Proceso' || incidencia.estado.tipo === 'Pendiente de Usuario'"
          @click="resolverIncidencia" 
          class="btn-action resolve">
          <i class="fas fa-check-circle"></i> Marcar como Resuelta
        </button>

        <button @click="asignar(incidencia.id)" class="btn-action assign">
          <i class="fas fa-user-plus"></i> Asignar Incidencia
        </button>
        <button @click="$emit('cerrar')" class="btn-secondary back">
          Cerrar
        </button>
      </footer>
    </div>
  </div>

  <AsignarModal
    v-if="mostrarAsignarModal"
    :incidencia="incidenciaAsignacion"
    @close="cerrarAsignarModal"
    @incidencia-asignada="incidenciaAsignadaHandler"
    @mensajeGlobal="mostrarMensajeExito"
  />
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import axios from "axios";
import AsignarModal from "/src/views/AsignarModal.vue"; 

const props = defineProps({
  incidencia: {
    type: Object,
    required: true,
  },
  fechaSLA: { 
      type: String, 
      default: null 
  } 
});

const $emit = defineEmits(["cerrar", "editar"]); 

const activeTab = ref("vista");
const mostrarAsignarModal = ref(false);
const incidenciaAsignacion = ref(null);
const selectedResponsable = ref("");

const usuariosDisponibles = ref([
  "Administrador",
  "Kevin Agrada",
  "Juan Perez",
  "user1",
  "user2",
  "Técnico Soporte",
]);

const estadosDisponibles = ref([
  "Abierta",
  "En Proceso",
  "Pendiente de Usuario",
  "Resuelta (Verificación)",
  "Cerrada",
]);

// Propiedad de la incidencia para simular el SLA (si no viene del prop)
if (!props.incidencia.fechaSLA) {
    props.incidencia.fechaSLA = ref(null);
}

// --- NUEVOS CAMPOS AÑADIDOS AL REGISTRO DE SEGUIMIENTO ---
const newSeguimiento = ref({
  descripcion: "",
  fecha: new Date().toISOString().substring(0, 16),
  nuevoEstado: props.incidencia.estado.tipo,
  responsablesInvolucrados: [],
  nombreAdjunto: null, 
  tiempoInvertido: "",          // <--- NUEVO: Tiempo de esfuerzo
  fechaCompromiso: "",          // <--- NUEVO: Nuevo SLA
  tipo: "Nota",                 // <--- NUEVO: Tipo de seguimiento
});

// --- Lógica de Manejo de Responsables (Tags) ---

const addResponsable = () => {
    if (selectedResponsable.value && !newSeguimiento.value.responsablesInvolucrados.includes(selectedResponsable.value)) {
        newSeguimiento.value.responsablesInvolucrados.push(selectedResponsable.value);
        selectedResponsable.value = ""; 
    }
};
const removeResponsable = (responsable) => {
    newSeguimiento.value.responsablesInvolucrados = newSeguimiento.value.responsablesInvolucrados.filter(r => r !== responsable);
};

// --- Lógica de Manejo de Archivos ---

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  newSeguimiento.value.nombreAdjunto = file ? file.name : null;
};

// --- Función para Notificar Usuario (Nueva) ---

const notificarUsuario = () => {
    if (!newSeguimiento.value.descripcion) {
        alert("❌ Debes escribir una nota de seguimiento para notificar al usuario.");
        return;
    }
    // NOTA: En un entorno real, aquí se llamaría a una API para enviar un email o notificación
    alert(`📧 Notificación enviada al usuario (${props.incidencia.usuario.nombre}) con la nota de seguimiento actual.`);
};

// --- Data Simulada para el Historial ---

const seguimientoSimulado = ref([
  {
    fecha: "13/10/2025, 09:15",
    usuario: "Administrador",
    tipo: "Escalamiento", // Nuevo Tipo de Seguimiento
    titulo: "Análisis Inicial y Escalamiento a Nivel 2",
    descripcion:
      "Se identificó un problema de configuración compleja que requiere intervención del equipo de Back-end. Se adjunta el archivo de log para revisión.",
    involucrados: ["Administrador", "Kevin Agrada"],
    adjuntoNombre: "log_error_131025.txt",
    tiempo: "1h 0m", // Tiempo invertido
  },
  {
    fecha: "12/10/2025, 14:30",
    usuario: "Sistema/Usuario",
    tipo: "Registro",
    titulo: "Incidencia Creada (Estado: Abierta)",
    descripcion:
      "Incidencia creada automáticamente por el sistema al enviar el formulario.",
    involucrados: ["Usuario Creador"],
    adjuntoNombre: null,
    tiempo: null,
  },
]);

const agregarSeguimientoSimulado = () => {
  if (!newSeguimiento.value.descripcion) {
    alert("La nota de seguimiento es obligatoria para registrar una actividad.");
    return;
  }

  const fechaFormateada = formatFechaInput(newSeguimiento.value.fecha);
  const estadoAnterior = props.incidencia.estado.tipo;
  
  const nuevoRegistro = {
    fecha: fechaFormateada,
    usuario: "Usuario Actual",
    tipo: newSeguimiento.value.tipo, 
    titulo: `Acción registrada (${newSeguimiento.value.tipo})`,
    descripcion: newSeguimiento.value.descripcion,
    involucrados: newSeguimiento.value.responsablesInvolucrados.slice(), 
    adjuntoNombre: newSeguimiento.value.nombreAdjunto,
    tiempo: newSeguimiento.value.tiempoInvertido || null,
  };
  seguimientoSimulado.value.unshift(nuevoRegistro); 
  
  if (newSeguimiento.value.nuevoEstado !== estadoAnterior) {
    props.incidencia.estado.tipo = newSeguimiento.value.nuevoEstado;
    seguimientoSimulado.value.unshift({ 
      fecha: fechaFormateada,
      usuario: "Sistema/Usuario Actual",
      tipo: "Estado", 
      titulo: `Cambio de Estado: ${estadoAnterior} → ${props.incidencia.estado.tipo}`,
      descripcion: `El estado fue actualizado por el usuario.`,
      involucrados: [],
      adjuntoNombre: null,
      tiempo: null,
    });
  }

  if (newSeguimiento.value.fechaCompromiso) {
      props.incidencia.fechaSLA = newSeguimiento.value.fechaCompromiso;
  }
  
  newSeguimiento.value.descripcion = "";
  newSeguimiento.value.fecha = new Date().toISOString().substring(0, 16);
  newSeguimiento.value.nuevoEstado = props.incidencia.estado.tipo;
  newSeguimiento.value.responsablesInvolucrados = [];
  newSeguimiento.value.nombreAdjunto = null; 
  newSeguimiento.value.tiempoInvertido = "";    
  newSeguimiento.value.fechaCompromiso = "";   
  newSeguimiento.value.tipo = "Nota"; 
  selectedResponsable.value = ""; 
  const fileInput = document.getElementById('adjuntoSeguimiento');
  if (fileInput) {
    fileInput.value = '';
  }
};

const resolverIncidencia = () => {
    const estadoActual = props.incidencia.estado.tipo;
    if (estadoActual === 'En Proceso' || estadoActual === 'Pendiente de Usuario') {
        const confirmacion = confirm(`¿Estás seguro de que deseas cambiar el estado a "Resuelta (Verificación)"?`);
        if (confirmacion) {
            const fechaFormateada = formatFechaInput(new Date().toISOString().substring(0, 16));
            const estadoAnterior = props.incidencia.estado.tipo;
            
            props.incidencia.estado.tipo = 'Resuelta (Verificación)';
            
            seguimientoSimulado.value.unshift({ 
                fecha: fechaFormateada,
                usuario: "Usuario Actual (Acción Rápida)",
                tipo: "Estado", 
                titulo: `Resuelta (Verificación) por acción rápida.`,
                descripcion: `Incidencia marcada como resuelta. Pendiente de la verificación final.`,
                involucrados: [],
                adjuntoNombre: null,
                tiempo: null,
            });
            mostrarMensajeExito("Incidencia marcada como Resuelta para verificación. ✨");
        }
    } else {
        alert("La incidencia debe estar en estado 'En Proceso' o 'Pendiente de Usuario' para usar esta acción rápida.");
    }
};

const formatFecha = (dateTimeStr) => {
  if (!dateTimeStr) return "N/A";
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFechaInput = (dateTimeInput) => {
  if (!dateTimeInput) return "N/A";
  const date = new Date(dateTimeInput);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(',', '');
};

const estadoClass = (estadoTipo) => {
  switch (estadoTipo) {
    case "Abierta":
      return "status-open";
    case "En Proceso":
    case "Resuelta (Verificación)":
      return "status-in-progress";
    case "Pendiente de Usuario":
      return "status-default";
    case "Cerrada":
      return "status-closed";
    default:
      return "status-default";
  }
};

const slaClass = (fechaSLA) => {
    if (!fechaSLA) return '';
    const diff = new Date(fechaSLA).getTime() - new Date().getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 0) return 'sla-overdue';
    if (days < 1) return 'sla-warning';
    return 'sla-ok'; 
};

const asignar = async (id) => {
    try {
        const url = `http://localhost:8081/api/incidencias/detalle?id=${id}`; 
        const resp = await axios.get(url); 
        incidenciaAsignacion.value = resp.data;
        mostrarAsignarModal.value = true;
    } catch (err) {
        console.error("Error al cargar detalle para asignar:", err);
        alert(
            "❌ No se pudo cargar el detalle de la incidencia para la asignación."
        );
    }
};
const cerrarAsignarModal = () => {
  mostrarAsignarModal.value = false;
};
const incidenciaAsignadaHandler = (incidenciaActualizada) => {
  cerrarAsignarModal();
  $emit("cerrar");
};
const mostrarMensajeExito = (mensaje) => {
  alert("✅ " + mensaje);
};

</script>

<style scoped>
.modal-header h2 {
    padding: 0;
    margin: 0;
    border-bottom: none;
    background-color: transparent;
    border-radius: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.modal-header h2 {
    padding: 0;
    margin: 0;
    border-bottom: none;
    background-color: transparent;
    border-radius: 0;
}
.input-with-button {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 5px;
}

.input-with-button select {
  flex-grow: 1;
}

.btn-icon.add-resp {
  background-color: #10b981; 
  color: white;
  border: none;
  padding: 0 14px;
  height: 36px;
  border-radius: 6px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-icon.add-resp:hover:not(:disabled) {
  background-color: #059669;
}

.btn-icon.add-resp:disabled {
  background-color: #999;
  cursor: not-allowed;
}
.tags-container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 5px;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    background-color: #f1f5f9;
}

.tag {
    display: inline-flex;
    align-items: center;
    background-color: #3b82f6; 
    color: white;
    padding: 5px 10px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
}

.tag-close {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    margin-left: 5px;
    cursor: pointer;
    line-height: 1;
    padding: 0 2px;
    transition: color 0.2s;
}
.involucrados-meta, .adjunto-meta {
    font-weight: 500;
    color: #475569;
    margin-left: 10px;
}


.tracking-table-container {
    overflow-x: auto;
    margin-top: 20px;
}

.tracking-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.tracking-table th,
.tracking-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
}

.tracking-table th {
    background-color: #f0f4f7;
    color: #333;
    font-weight: bold;
    text-transform: uppercase;
}

.tracking-table tbody tr:hover {
    background-color: #f7f7f7;
}

.tracking-table .row-estado {
    background-color: #e6f7ff; 
}

.tracking-table .row-registro {
    background-color: #fffbe6;
}
.tipo-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    color: white;
}

.badge-nota {
    background-color: #6c757d;
}

.badge-estado {
    background-color: #007bff;
}

.badge-registro {
    background-color: #ffc107;
    color: #333;
}

.no-tracking-message {
    text-align: center;
    padding: 20px;
    color: #999;
    font-style: italic;
    background-color: #fcfcfc;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
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
  max-width: 1200px;
  max-height: 95%;
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
  background: #2952b9;
  color: white; 
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #2952b9; 
}
.btn-primary.edit:hover {
  background: #5d74af;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  border-color: #5d74af;
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

.status-default {
  color: #7c3aed;
  background-color: #f5f3ff;
}

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.dot-asignación {
  background-color: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
}
.dot-nota {
  background-color: #fb923c;
  box-shadow: 0 0 0 2px #fb923c;
}
.dot-estado {
  background-color: #10b981;
  box-shadow: 0 0 0 2px #10b981;
}
.dot-solución {
  background-color: #6366f1;
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
