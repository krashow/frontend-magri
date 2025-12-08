<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Asignar Responsable a Incidencia #{{ incidencia.id }}</h3>
        <button @click="$emit('close')" class="close-button">&times;</button>
      </div>

      <div class="modal-body">
        <p class="incidencia-desc">
          Incidencia: **{{
            incidencia.dscInc ||
            incidencia.descripcionInc ||
            "Cargando descripción..."
          }}**
        </p>

        <div class="form-group">
          <label for="responsable">Seleccionar Responsable:</label>
          <select
            id="responsable"
            v-model="idResponsableSeleccionado"
            :disabled="cargandoResponsables"
            class="form-select"
          >
            <option :value="null" disabled>-- Selecciona un técnico --</option>
            <option v-if="cargandoResponsables" disabled>Cargando...</option>

            <option
              v-for="responsable in listaResponsables"
              :key="responsable.id"
              :value="responsable.id"
            >
              {{ responsable.nombre }} ({{ responsable.username }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="observacion">Observación (Opcional):</label>
          <textarea
            id="observacion"
            v-model="observacion"
            rows="3"
            placeholder="Añade un comentario sobre la asignación..."
            class="form-control"
          ></textarea>
        </div>

        <p v-if="errorMensaje" class="error-message">{{ errorMensaje }}</p>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn-secondary">
          Cancelar
        </button>
        <button
          @click="asignarIncidencia"
          :disabled="!idResponsableSeleccionado || cargando"
          class="btn btn-primary"
        >
          {{ cargando ? "Asignando..." : "Confirmar Asignación" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    incidencia: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      idResponsableSeleccionado: null,
      observacion: "",
      listaResponsables: [],
      cargandoResponsables: false,
      cargando: false,
      errorMensaje: null,
      // CAMBIO CLAVE 1: URL del Notificador de vuelta a la IP real para despliegue
      NOTIFIER_URL: "http://192.168.1.116:3000", 
    };
  },
  methods: {
    async cargarResponsables() {
      this.cargandoResponsables = true;
      this.errorMensaje = null;
      try {
        // Usa la URL completa: http://192.168.1.116:8081/api/usuarios/responsables
        // NOTA: Aquí asumimos que tienes configurado el baseURL de Axios o que usarás la URL completa.
        // Si no usas baseURL, esta línea fallará. **Lo mantengo relativo si usas baseURL global.**
        const response = await axios.get("/api/usuarios/responsables");

        this.listaResponsables = response.data;
        console.log("✅ Responsables cargados con éxito.");
      } catch (error) {
        console.error(
          "❌ Error al cargar responsables:",
          error.response || error
        );

        let mensaje = "No se pudieron cargar los responsables. ";

        if (error.response && error.response.status === 403) {
          mensaje +=
            "Acceso denegado (Error 403). Confirma que la seguridad de Spring Boot permite la ruta /api/usuarios/responsables sin autenticar.";
        } else if (error.response && error.response.status === 404) {
          mensaje +=
            "Ruta no encontrada (Error 404). Verifica que el endpoint `/api/usuarios/responsables` exista y que el puerto sea `8081`.";
        } else {
          mensaje +=
            "Revisa la URL, el puerto (8081), y los permisos del backend.";
        }

        this.errorMensaje = mensaje;
      } finally {
        this.cargandoResponsables = false;
      }
    },
    
    // --- FUNCIÓN CORREGIDA: NOTIFICAR ASIGNACIÓN ---
    async notificarAsignacion(incidenciaActualizada, responsableAsignado) {
        const emailData = {
            assignedTo: responsableAsignado.nombre,
            assignedToEmail: responsableAsignado.email,
            incidentId: `INC-${incidenciaActualizada.id}`,
            status: incidenciaActualizada.estado?.tipo || 'Asignada', 
            priority: this.incidencia.prioridad || 'Media', 
            reporter: this.incidencia.usuario?.nombre || 'S/I', 
            creationDate: this.incidencia.fechaCreacion ? new Date(this.incidencia.fechaCreacion).toLocaleString() : new Date().toLocaleString(),
            
            // CAMBIO CLAVE 2: Link de vuelta a la IP real para despliegue
            linkToTicket: `http://192.168.1.116:8081/incidencias/${incidenciaActualizada.id}`, 
            
            assignedBy: 'Sistema/Administrador', 
        };

        try {
            // Usa NOTIFIER_URL con la IP real (192.168.1.116:3000)
            await axios.post(`${this.NOTIFIER_URL}/api/notificar-asignacion`, emailData);
            console.log(`✅ Solicitud de notificación enviada al Notificador Node para ${responsableAsignado.nombre}.`);
        } catch (error) {
            console.error("❌ Error al solicitar la notificación por correo (Node Service):", error.response || error);
            // CAMBIO CLAVE 3: Mensaje de error de vuelta a la IP real
            this.$emit("mensajeGlobal", `⚠️ Advertencia: Incidencia asignada, pero falló el envío de correo. Asegúrate que Node esté corriendo en http://192.168.1.116:3000`);
        }
    },

    // --- FUNCIÓN: ASIGNAR INCIDENCIA ---
    async asignarIncidencia() {
      if (!this.idResponsableSeleccionado) {
        this.errorMensaje = "Debes seleccionar un responsable.";
        return;
      }
      this.cargando = true;
      this.errorMensaje = null;
      const asignacionData = {
        idIncidencia: this.incidencia.id,
        idResponsable: this.idResponsableSeleccionado,
        observacion: this.observacion,
      };
      console.log("Datos de asignación a enviar:", asignacionData);
      try {
        // Usa la ruta relativa /api/incidencias/asignar-responsable
        const endpoint = `/api/incidencias/asignar-responsable`;
        const response = await axios.post(endpoint, asignacionData);
        
        const incidenciaActualizada = response.data;
        const responsableAsignado = this.listaResponsables.find(r => r.id === this.idResponsableSeleccionado);
        
        if (responsableAsignado && responsableAsignado.email) {
            this.notificarAsignacion(incidenciaActualizada, responsableAsignado); 
        } else {
            console.warn("No se pudo notificar: Responsable no encontrado o le falta el campo 'email'.");
        }
        
        this.$emit(
          "mensajeGlobal",
          `Incidencia #${incidenciaActualizada.id} asignada a ${incidenciaActualizada.responsable.nombre} correctamente.`
        );
        this.$emit("asignacionExitosa", incidenciaActualizada);
        this.$emit("close");
        console.log(
          `✅ Incidencia #${this.incidencia.id} asignada con éxito al técnico.`
        );
        console.log("Respuesta del servidor:", incidenciaActualizada);
      } catch (error) {
        console.error("❌ Error al asignar:", error.response || error);
        let mensaje = "Error de red/servidor. Intenta de nuevo.";

        if (error.response) {
          switch (error.response.status) {
            case 403:
              mensaje =
                "Acceso denegado (Error 403). El servidor requiere autenticación para asignar.";
              break;
            case 404:
              mensaje =
                "Error: Incidencia o usuario no encontrado en la base de datos (Error 404).";
              break;
            case 409:
              mensaje =
                "Acción denegada: No se puede asignar un responsable a una incidencia que ya está Cerrada.";
              break;
            case 500:
              mensaje =
                "Error interno del servidor (500). Revisa la consola de tu servidor Spring Boot.";
              break;
            default:
              mensaje = `Error al asignar: ${error.response.status} - ${
                error.response.statusText || "Error desconocido"
              }.`;
          }
        }
        this.errorMensaje = mensaje;
      } finally {
        this.cargando = false;
      }
    },
  },
  mounted() {
    this.cargarResponsables();
    console.log(
      "Modal de Asignación Abierto. Propiedad Incidencia:",
      this.incidencia
    );
  },
};
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}
.close-button:hover {
  color: #dc3545;
}
.incidencia-desc {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  font-size: 0.95em;
}
.form-group {
  margin-bottom: 15px;
}
.form-select,
.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-select:focus,
.form-control:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
}
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s, opacity 0.2s;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}
.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
