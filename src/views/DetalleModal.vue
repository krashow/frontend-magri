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

          <hr style="margin-top: 32px;" />
          <section class="tracking-log">
            <h3>Historial de Seguimiento (Clic para Expandir Detalle)</h3>
            <div class="tracking-table-container">
              <table class="tracking-table">
                <thead>
                  <tr>
                    <th style="width: 100px;">Fecha</th>
                    <th style="width: 80px;">Tipo</th>
                    <th style="width: 150px;">Título/Estado</th>
                    <th style="width: 100px;">Usuario</th>
                    <th style="width: 80px;">Tiempo</th> 
                    <th style="width: 180px;">Involucrados</th>
                    <th style="width: 150px;">Adjuntos</th>
                    <th>Descripción (Previa)</th>
                  </tr>
                </thead>
                <tbody id="tabla-historial-body"> <template
                    v-for="(item, index) in historialGestion"
                    :key="item.idGestion" 
                  >
                    <tr
                      :class="[
                        `row-${item.tipo.toLowerCase().replace(' ', '-')}`,
                        { 'is-expanded': activeSeguimientoIndex === index }
                      ]"
                      @click="toggleSeguimiento(index)"
                      style="cursor: pointer;"
                    >
                      <td>{{ item.fecha }}</td>
                      <td>
                        <span :class="['tipo-badge', `badge-${item.tipo.toLowerCase().replace(' ', '-')}`]">
                          {{ item.tipo }}
                        </span>
                      </td>
                      <td><strong>{{ item.titulo || item.nuevoEstado }}</strong></td>
                      <td>{{ item.usuario }}</td>
                      <td>{{ item.tiempoInvertido || 'N/A' }}</td>
                      <td>{{ item.involucrados && item.involucrados.length ? item.involucrados.length + ' involucrados' : 'N/A' }}</td> 
                      <td>{{ item.adjuntoRuta ? ' Adjunto' : 'N/A' }}</td>
                      <td class="description-preview">
                        {{ item.descripcion.substring(0, 50) + (item.descripcion.length > 50 ? '...' : '') }}
                      </td>
                    </tr>

                    <tr v-if="activeSeguimientoIndex === index" class="tracking-detail-row-card">
                      <td colspan="8">
                        <div class="detail-card-box"> <h4>Detalle del Registro #{{ index + 1 }}</h4>
                            
                            <div class="card-meta-group">
                                <div class="meta-column">
                                    <p>
                                        <strong>Fecha y Hora:</strong>
                                        <span class="highlight-date">{{ item.fecha }}</span>
                                    </p>
                                    <p v-if="item.fechaCompromiso">
                                        <strong>Nuevo SLA:</strong> 
                                        <span class="highlight-sla">{{ formatFecha(item.fechaCompromiso) }}</span>
                                    </p>
                                    <p>
                                        <strong>Tiempo Invertido:</strong> 
                                        <span>{{ item.tiempoInvertido || 'N/A' }}</span>
                                    </p>
                                </div>
                                
                                <div class="meta-column">
                                    <p>
                                        <strong>Involucrados:</strong> 
                                        <span v-if="item.involucrados && item.involucrados.length">
                                            {{ item.involucrados.join(", ") }}
                                        </span>
                                        <span v-else>Ninguno.</span>
                                    </p>
                                    <p v-if="item.adjuntoRuta">
                                        <strong>Archivo Adjunto:</strong> 
                                        <a href="#" @click.prevent="alert('Descargando ' + item.adjuntoRuta)" class="adjunto-link">
                                            📎 {{ item.adjuntoRuta }} (Descargar)
                                        </a>
                                    </p>
                                </div>
                            </div>
                            
                            <p class="description-heading"><strong>Descripción Completa:</strong></p>
                            <div class="description-content">
                                <pre>{{ item.descripcion }}</pre>
                            </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                  
                  <tr v-if="!historialGestion || historialGestion.length === 0">
                    <td colspan="8" class="no-tracking-message"> Aún no hay registros de seguimiento para esta incidencia.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-show="activeTab === 'seguimiento'" class="tab-content">
          <section class="new-tracking-form">
            <h4>Añadir Seguimiento y/o Cambiar Estado</h4>
            
            <div id="gestion-mensaje-estado" style="color: blue; margin-bottom: 10px;"></div>

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
              @click="registrarGestionCompleto"
              class="btn-primary edit"
            >
              Registrar Seguimiento
            </button>
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
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import axios from "axios";
import AsignarModal from "/src/views/AsignarModal.vue"; 

// --- CONFIGURACIÓN DE API Y USUARIOS ---
const BASE_URL = "http://localhost:8081/api/gestion";
const ID_USUARIO_ACTUAL = 1; // ⚠️ IMPORTANTE: REEMPLAZA ESTE '1' CON EL ID DEL USUARIO LOGUEADO REAL

// Mapeo estático de usuarios: Necesario para enviar IDs en el POST y mostrar Nombres en el GET
const mapaUsuarios = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Kevin Agrada" },
    { id: 3, nombre: "Juan Perez" },
    { id: 4, nombre: "user1" },
    { id: 5, nombre: "user2" },
    { id: 6, nombre: "Técnico Soporte" },
];

const usuariosDisponibles = ref(mapaUsuarios.map(u => u.nombre)); // Array de nombres para el <select>
// ------------------------------------

// --- VARIABLES DE ESTADO ---
const activeSeguimientoIndex = ref(null);
const historialGestion = ref([]); // ESTA VARIABLE REEMPLAZA a seguimientoSimulado
const isProcessing = ref(false); // Para deshabilitar el botón de registro
// ------------------------------------

const toggleSeguimiento = (index) => {
  activeSeguimientoIndex.value = activeSeguimientoIndex.value === index ? null : index;
};

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

const estadosDisponibles = ref([
  "Abierta",
  "En Proceso",
  "Pendiente de Usuario",
  "Resuelta (Verificación)",
  "Cerrada",
]);

if (!props.incidencia.fechaSLA) {
    props.incidencia.fechaSLA = ref(null);
}
const newSeguimiento = ref({
  descripcion: "",
  fecha: new Date().toISOString().substring(0, 16),
  nuevoEstado: props.incidencia.estado.tipo,
  responsablesInvolucrados: [],
  nombreAdjunto: null, 
  tiempoInvertido: "",          
  fechaCompromiso: "",         
  tipo: "Nota",               
});

const getMensajeEstadoDiv = () => {
    return document.getElementById('gestion-mensaje-estado');
};

// ====================================================================================
// === FUNCIONES DE GESTIÓN (POST y GET REALES) =======================================
// ====================================================================================

// Función auxiliar para manejar el POST
const ejecutarPost = async (data) => {
    isProcessing.value = true;
    const estadoDiv = getMensajeEstadoDiv();
    if (estadoDiv) estadoDiv.textContent = "📝 Enviando registro de gestión...";
    
    try {
        await axios.post(`${BASE_URL}/registrar`, data);

        if (estadoDiv) estadoDiv.textContent = "✅ Gestión registrada con éxito. Actualizando historial...";
        return true; 

    } catch (error) {
        console.error("Error en el registro de gestión:", error);
        const errorMessage = error.response?.data?.mensaje || `Error ${error.response?.status || 500} al registrar.`;
        if (estadoDiv) estadoDiv.textContent = `❌ Error al registrar: ${errorMessage}`;
        return false;

    } finally {
        isProcessing.value = false;
    }
};


// Función para obtener y mostrar el historial (GET)
const cargarHistorial = async () => {
    const url = `${BASE_URL}/historial/${props.incidencia.id}`;
    const estadoDiv = getMensajeEstadoDiv();
    if (estadoDiv) estadoDiv.textContent = "🔍 Cargando historial...";
    
    // Función auxiliar para convertir IDs (del API) a Nombres (para la tabla)
    const getNamesFromIds = (idString) => {
        if (!idString) return [];
        // Divide el string "1,2,5" en un array de números
        const ids = idString.toString().split(',').map(s => parseInt(s.trim()));
        // Mapea cada ID al nombre correspondiente
        return ids.map(id => {
            const user = mapaUsuarios.find(u => u.id === id);
            return user ? user.nombre : `ID ${id}`;
        });
    };
    
    try {
        const respuesta = await axios.get(url);
        
        // Mapeo y ajuste de datos del backend a la tabla de Vue
        historialGestion.value = respuesta.data.map(item => ({
            idGestion: item.id, // Tu API usa 'id' como ID de gestión (bigserial)
            fecha: formatFechaInput(item.fecha_registro), // Tu API usa 'fecha_registro'
            usuario: item.nombreUsuario || 'S/I', // Suponemos que tu backend debe incluir el nombre del usuario
            tipo: item.tipo,
            descripcion: item.descripcion,
            nuevoEstado: item.nuevo_estado, // Tu API usa 'nuevo_estado'
            tiempoInvertido: item.tiempo_invertido, // Tu API usa 'tiempo_invertido'
            adjuntoRuta: item.adjunto_ruta, // Tu API usa 'adjunto_ruta'
            fechaCompromiso: item.fecha_compromiso, // Tu API usa 'fecha_compromiso'
            // CONVERTIMOS LA CADENA DE IDs A NOMBRES PARA MOSTRAR:
            involucrados: getNamesFromIds(item.involucrados), 
            titulo: item.nuevo_estado ? `Cambio a ${item.nuevo_estado}` : item.tipo,
        }));
        
        if (estadoDiv) estadoDiv.textContent = `✅ Historial actualizado: ${historialGestion.value.length} entradas.`;

    } catch (error) {
        console.error("Error al obtener el historial:", error);
        if (estadoDiv) estadoDiv.textContent = "❌ Error al cargar el historial. Revise la consola.";
        historialGestion.value = [];
    }
};

// Función principal que se llama desde el botón (POST -> GET)
const registrarGestionCompleto = async () => {
    if (!newSeguimiento.value.descripcion) {
        alert("La nota de seguimiento es obligatoria para registrar una actividad.");
        return;
    }
    
    // --- LÓGICA CLAVE: CONVERTIR NOMBRES SELECCIONADOS A IDs (string "1,2,3") ---
    const involucradosIDs = newSeguimiento.value.responsablesInvolucrados
        .map(nombre => {
            const user = mapaUsuarios.find(u => u.nombre === nombre);
            return user ? user.id : null; 
        })
        .filter(id => id !== null) 
        .join(','); 
    // -----------------------------------------------------------------------------

    // 1. Mapeo de datos para el POST (API)
    // Coincide con la estructura de tu base de datos: id_inc, id_user, nuevo_estado, tiempo_invertido, fecha_compromiso
    const datosParaAPI = {
        "idIncidencia": props.incidencia.id,
        "idUsuario": ID_USUARIO_ACTUAL, 
        "tipo": newSeguimiento.value.tipo, 
        "descripcion": newSeguimiento.value.descripcion, 
        "nuevoEstado": newSeguimiento.value.nuevoEstado, 
        "tiempoInvertido": newSeguimiento.value.tiempoInvertido || "0h 0m",
        "adjuntoRuta": newSeguimiento.value.nombreAdjunto, 
        "fechaCompromiso": newSeguimiento.value.fechaCompromiso || null,
        "involucrados": involucradosIDs || null, // Se envía la cadena de IDs
    };

    // 2. Ejecutar POST
    const postExitoso = await ejecutarPost(datosParaAPI);

    if (postExitoso) {
        // 3. Recargar el historial para actualizar la tabla (GET)
        await cargarHistorial();

        // 4. Actualizar el estado de la incidencia si cambió
        props.incidencia.estado.tipo = datosParaAPI.nuevoEstado;
        if (datosParaAPI.fechaCompromiso) {
            props.incidencia.fechaSLA = datosParaAPI.fechaCompromiso;
        }
        
        // 5. Limpiar el formulario
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
        if (fileInput) fileInput.value = '';
    }
};

// Función modificada para usar la nueva lógica (solo si es necesario)
const resolverIncidencia = async () => {
    const estadoActual = props.incidencia.estado.tipo;
    if (estadoActual === 'En Proceso' || estadoActual === 'Pendiente de Usuario') {
        const confirmacion = confirm(`¿Estás seguro de que deseas cambiar el estado a "Resuelta (Verificación)"?`);
        if (confirmacion) {
            // Creamos un registro de gestión para el cambio de estado (POST)
            const datosParaAPI = {
                "idIncidencia": props.incidencia.id,
                "idUsuario": ID_USUARIO_ACTUAL,
                "tipo": "Estado", 
                "descripcion": `Incidencia marcada como resuelta para verificación. Acción rápida.`,
                "nuevoEstado": 'Resuelta (Verificación)',
                "tiempoInvertido": "0h 0m",
                "adjuntoRuta": null, 
                "fechaCompromiso": null,
                "involucrados": null,
            };

            const postExitoso = await ejecutarPost(datosParaAPI);

            if (postExitoso) {
                props.incidencia.estado.tipo = 'Resuelta (Verificación)';
                await cargarHistorial();
                mostrarMensajeExito("Incidencia marcada como Resuelta para verificación. ✨");
            }
        }
    } else {
        alert("La incidencia debe estar en estado 'En Proceso' o 'Pendiente de Usuario' para usar esta acción rápida.");
    }
};

// ====================================================================================
// === LLAMADAS INICIALES Y AUXILIARES (SE MANTIENEN) =================================
// ====================================================================================

const addResponsable = () => {
    if (selectedResponsable.value && !newSeguimiento.value.responsablesInvolucrados.includes(selectedResponsable.value)) {
        newSeguimiento.value.responsablesInvolucrados.push(selectedResponsable.value);
        selectedResponsable.value = ""; 
    }
};
const removeResponsable = (responsable) => {
    newSeguimiento.value.responsablesInvolucrados = newSeguimiento.value.responsablesInvolucrados.filter(r => r !== responsable);
};


const handleFileUpload = (event) => {
  const file = event.target.files[0];
  newSeguimiento.value.nombreAdjunto = file ? file.name : null;
};


const notificarUsuario = () => {
    if (!newSeguimiento.value.descripcion) {
        alert("❌ Debes escribir una nota de seguimiento para notificar al usuario.");
        return;
    }
    alert(`📧 Notificación enviada al usuario (${props.incidencia.usuario.nombre}) con la nota de seguimiento actual.`);
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

// Cargar el historial cuando el componente se monta por primera vez
onMounted(() => {
    cargarHistorial();
});

// Watcher para recargar el historial si se cambia a la pestaña 'seguimiento' (opcional, pero útil)
watch(activeTab, (newTab) => {
    if (newTab === 'seguimiento') {
        cargarHistorial();
    }
});

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


.tracking-table {
    width: 100%;
    border-collapse: collapse;
}

.tracking-table th {
    background-color: #eef2f7; 
    text-align: left;
    padding: 10px 12px;
    font-size: 0.9em;
    border-bottom: 2px solid #ddd;
    font-weight: 700;
    color: #444;
}

.tracking-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.85em;
    vertical-align: top;
}
.tipo-badge {
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.75em;
    display: inline-block;
}
.badge-nota { background-color: #e0f7fa; color: #0097a7; }
.badge-escalamiento { background-color: #ffe0b2; color: #ff8f00; }
.badge-solución-aplicada { background-color: #c8e6c9; color: #388e3c; }
.badge-requerimiento-info { background-color: #ffccbc; color: #d84315; }

.tracking-table tr.is-expanded {
    background-color: #e9eff5; 
    border-bottom: none; 
    font-weight: 600; 
}

.tracking-detail-row-card {
    background-color: #f7f7f7; 
}

.tracking-detail-row-card td {
    padding: 10px 12px 20px 12px !important; 
    border-bottom: 2px solid #3b82f6; 
}
.detail-card-box {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px; 
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); 
    padding: 20px;
    margin-top: 5px; 
}

.detail-card-box h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #3b82f6; 
    font-size: 1.1em;
    padding-bottom: 5px;
    border-bottom: 2px dashed #f0f0f0;
}

.card-meta-group {
    display: flex;
    gap: 50px; 
    margin-bottom: 15px;
}

.meta-column {
    flex: 1;
    min-width: 40%;
}

.meta-column p {
    margin: 0;
    padding: 3px 0;
    font-size: 0.9em;
}
.highlight-date {
    font-weight: 700;
    color: #333;
}
.highlight-sla {
    font-weight: 700;
    color: #c0392b; 
}
.description-heading {
    margin: 15px 0 5px 0;
    font-size: 0.95em;
    color: #333;
}
.description-content pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit; 
    font-size: 0.9em;
    padding: 10px;
    background-color: #f9f9f9; 
    border: 1px dashed #e0e0e0;
    border-radius: 4px;
    color: #444;
}
.adjunto-link {
    font-weight: 600;
    color: #2980b9;
    text-decoration: none;
}

.btn-action.resolve {
    background-color: #10b981;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}
.btn-action.resolve:hover {
    background-color: #059669;
}
.btn-action.assign {
    background-color: #3b82f6;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}
.btn-action.assign:hover {
    background-color: #2563eb;
}
.btn-primary.edit {
    background: #2952b9;
    color: white; 
}
.btn-secondary.notify {
    background-color: #1495b6;
    color: #1e293b; 
    padding: 10px 20px;
    border: 1px solid #0a5264;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}
.btn-secondary.notify:hover {
    background-color: #0a5264; 
    color: white; 
}
.btn-secondary.notify:disabled,
.btn-primary.edit:disabled {
    background-color: #cbd5e1 !important;
    color: #94a3b8 !important;
    cursor: not-allowed !important;
    border-color: #e2e8f0 !important;
}
</style>
