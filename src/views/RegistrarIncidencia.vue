<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <nav class="menu">
        <ul>
          <li :class="{ active: currentRoute === '/dashboard' }" @click="navigateTo('/dashboard')">
            <i class="fas fa-tachometer-alt"></i>
            <span>Inicio</span>
          </li>
          <li :class="{ active: currentRoute === '/registrar-incidencia' }" @click="navigateTo('/registrar-incidencia')">
            <i class="fas fa-plus-circle"></i>
            <span>Registrar Incidencia</span>
          </li>
          <li :class="{ active: currentRoute === '/incidencias' }" @click="navigateTo('/incidencias')">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Incidencias</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/usuarios' }"
            @click="navigateTo('/usuarios')"
          >
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/notificaciones' }"
            @click="navigateTo('/notificaciones')"
          >
            <i class="fas fa-bell"></i>
            <span>Asignaciones</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/reportes' }"
            @click="navigateTo('/reportes')"
          >
            <i class="fas fa-chart-bar"></i>
            <span>Reportes</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-bottom">
        <button class="icon-btn"><i class="fas fa-cog"></i></button>
        <button @click="logout" class="icon-btn logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span>{{ userName }}</span>
        </div>
      </header>

      <section class="form-section">
        <h2>Registrar Nueva Incidencia</h2>

        <div class="form-group">
          <label for="categoria">Categoría:</label>
          <select v-model="categoriaSeleccionada" @change="cargarPreguntas">
            <option disabled value="">Seleccione una categoría</option>
            <option value="1">Software</option>
            <option value="2">Hardware</option>
            <option value="3">Otro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="area">Área:</label>
          <select v-model="areaSeleccionada">
            <option disabled value="">Seleccione el área</option>
            <option :value="1">Sistemas</option>
            <option :value="2">Administración</option>
            <option :value="3">Operaciones</option>
          </select>
        </div>

        <div class="form-group">
          <label for="prioridad">Urgencia / Prioridad:</label>
          <select v-model="prioridadSeleccionada">
            <option disabled value="">Seleccione la prioridad</option>
            <option :value="1">Baja</option>
            <option :value="2">Media</option>
            <option :value="3">Alta</option>
            <option :value="4">Crítica</option>
          </select>
        </div>

        <div v-if="preguntas.length > 0" class="preguntas-box">
          <h3>Detalles de la incidencia</h3>

          <div v-for="pregunta in preguntas" :key="pregunta.id" class="form-group">
            <label>{{ pregunta.pregunta }}</label>

            <input
              v-if="pregunta.tipoCampo === 'text'"
              v-model="respuestas[pregunta.id]"
              type="text"
              placeholder="Escriba su respuesta"
            />

            <input
              v-else-if="pregunta.tipoCampo === 'date'"
              v-model="respuestas[pregunta.id]"
              type="date"
            />
            
            <div v-else-if="pregunta.tipoCampo === 'checkbox'" class="checkbox-group">
                <input
                    type="checkbox"
                    :id="'check-' + pregunta.id"
                    v-model="respuestas[pregunta.id]"
                />
                <label :for="'check-' + pregunta.id">Marcar si aplica</label>
            </div>
            
            <textarea
              v-else-if="pregunta.tipoCampo === 'textarea'"
              v-model="respuestas[pregunta.id]"
              placeholder="Describa brevemente"
            ></textarea>

            <select
              v-else-if="pregunta.tipoCampo === 'select'"
              v-model="respuestas[pregunta.id]"
            >
              <option disabled value="">Seleccione una opción</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
            
            <p v-else style="color: red; font-size: 12px;">Error: Tipo de campo '{{ pregunta.tipoCampo }}' no soportado.</p>

          </div>
          
          <div class="form-group">
            <label for="observacion">Observación (Detalle adicional):</label>
            <textarea
              v-model="observacionTexto"
              placeholder="Especifique cualquier detalle adicional que pueda ayudar a resolver la incidencia."
            ></textarea>
          </div>
          <div class="form-group file-upload-group">
            <label for="file-upload">Adjuntar Archivo/Evidencia (Opcional):</label>
            
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileChange"
              id="file-upload" 
              accept="image/*, .pdf"
              style="display: none;" 
            />

            <button 
              type="button" 
              class="btn-file-upload" 
              @click="openFilePicker"
            >
              <i class="fas fa-camera"></i> Insertar Imagen / Archivo
            </button>
            
            <span v-if="selectedFile" class="file-name-display">
              Archivo seleccionado: {{ selectedFile.name }}
            </span>
          </div>
          
          <button class="btn-login" @click="enviarIncidencia">Registrar Incidencia</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter, useRoute } from "vue-router"
import "./Dashboard.css"

const router = useRouter()
const route = useRoute()
const currentRoute = route.path
const userName = "Administrador"

const categoriaSeleccionada = ref("")
const preguntas = ref([])
const respuestas = ref({})

const prioridadSeleccionada = ref("") 

const areaSeleccionada = ref("")
const observacionTexto = ref("") 

const fileInput = ref(null)
const selectedFile = ref(null)


// Logout
const logout = () => {
  if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
    router.push("/login")
  }
}
const openFilePicker = () => {
  fileInput.value.click() 
}
const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0]
  } else {
    selectedFile.value = null
  }
}
const navigateTo = (path) => {
  router.push(path)
}
const cargarPreguntas = async () => {
  try {
    const resp = await axios.get(`http://localhost:8081/api/incidencias/preguntas/${categoriaSeleccionada.value}`)
    preguntas.value = resp.data
  } catch (err) {
    console.error("Error al cargar preguntas:", err)
    alert("No se pudieron cargar las preguntas.")
  }
}
const enviarIncidencia = async () => {
    if (!categoriaSeleccionada.value || !areaSeleccionada.value || !prioridadSeleccionada.value) {
        alert("❌ Debe seleccionar una Categoría, un Área y una Prioridad.")
        return
    }

    const data = {
        idCategoria: categoriaSeleccionada.value,
        idArea: areaSeleccionada.value, 
        idPrioridad: prioridadSeleccionada.value,
        observacion: observacionTexto.value, 
        respuestas: respuestas.value
    }
    try {
        const resp = await axios.post("http://localhost:8081/api/incidencias/registrar", data)
        if (resp.data.success) {
            alert(`✅ ${resp.data.message}`)
            categoriaSeleccionada.value = ""
            areaSeleccionada.value = ""
            prioridadSeleccionada.value = ""
            observacionTexto.value = ""
            respuestas.value = {}
            preguntas.value = []
            
            router.push("/dashboard")
        } else {
            alert(`❌ Error del servidor: ${resp.data.message}`)
        }
    } catch (err) {
        console.error("Error al registrar incidencia:", err.response?.data || err.message)
        alert("❌ No se pudo registrar la incidencia. Revise la consola para detalles.")
    }
}
</script>

<style scoped src="./Dashboard.css"></style>