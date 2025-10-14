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
                    <li :class="{ active: currentRoute === '/registrar-incidencia' }"
                        @click="navigateTo('/registrar-incidencia')">
                        <i class="fas fa-plus-circle"></i>
                        <span>Registrar Incidencia</span>
                    </li>
                    <li :class="{ active: currentRoute === '/incidencias' }" @click="navigateTo('/incidencias')">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Incidencias</span>
                    </li>
                    <li :class="{ active: currentRoute === '/usuarios' }" @click="navigateTo('/usuarios')">
                        <i class="fas fa-users"></i>
                        <span>Usuarios</span>
                    </li>
                    <li :class="{ active: currentRoute === '/notificaciones' }" @click="navigateTo('/notificaciones')">
                        <i class="fas fa-bell"></i>
                        <span>Asignaciones</span>
                    </li>
                    <li :class="{ active: currentRoute === '/reportes' }" @click="navigateTo('/reportes')">
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

            <section class="table-section">
                <h2>Lista de Incidencias Registradas</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Categoría</th>
                                <th>Área</th>
                                <th>Prioridad</th>
                                <th>Observación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="incidencia in incidencias" :key="incidencia.id">
                                <td>{{ incidencia.id }}</td>
                                <td>{{ formatFecha(incidencia.fechaRegistro) }}</td>
                                <td>{{ incidencia.usuario ? incidencia.usuario.nombre : 'S/I' }}</td>
                                <td>{{ incidencia.categoria.nombre }}</td>
                                <td>{{ incidencia.area ? incidencia.area.nombre : 'S/I' }}</td>
                                <td>{{ incidencia.prioridad ? incidencia.prioridad.nombre : 'S/I' }}</td>
                                <td>{{ truncateText(incidencia.obsInc || incidencia.dscInc) }}</td>

                                <td :class="estadoClass(incidencia.estado.tipo)">
                                    {{ incidencia.estado.tipo }}
                                </td>

                                <td>
                                    <button @click="verDetalle(incidencia.id)" class="btn-action view">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <!--<button @click="asignar(incidencia.id)" class="btn-action assign">
                                        <i class="fas fa-user-plus"></i>
                                    </button>-->
                                    <button @click="confirmarEliminar(incidencia.id)" class="btn-action delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="incidencias.length === 0" class="no-data">
                        No hay incidencias registradas.
                    </div>
                </div>

            </section>
        </main>
    </div>
    <DetalleModal
    v-if="mostrarModal"
    :incidencia="incidenciaSeleccionada"
    @cerrar="mostrarModal = false"
    @editar="iniciarEdicionModal"
    />

</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter, useRoute } from "vue-router"
import "./Dashboard.css" 
import DetalleModal from '/src/views/DetalleModal.vue';

const router = useRouter()
const route = useRoute()
const currentRoute = route.path
const userName = "Administrador"

const incidencias = ref([])
const incidenciaSeleccionada = ref(null)
const mostrarModal = ref(false) 
const mostrarAsignarModal = ref(false) 

onMounted(() => {
    cargarIncidencias()
})


const handleDetalleModalClose = () => {
    mostrarModal.value = false;
    cargarIncidencias(); 
}

const cargarIncidencias = async () => {
    try {
        const resp = await axios.get("http://localhost:8081/api/incidencias")
        incidencias.value = resp.data
        console.log("Datos de incidencias:", resp.data)

    } catch (err) {
        console.error("Error al cargar incidencias:", err)
        alert("❌ No se pudieron cargar las incidencias.")
    }
}
const verDetalle = async (id) => {
    try {
        const url = `http://localhost:8081/api/incidencias/detalle?id=${id}`;
        
        const resp = await axios.get(url);
        
        incidenciaSeleccionada.value = resp.data;
        mostrarModal.value = true;
        
    } catch (err) {
        console.error("Error al cargar detalle para el modal:", err);
        alert("❌ No se pudo cargar el detalle de la incidencia.");
    }
}

const iniciarEdicionModal = (id) => {
    mostrarModal.value = false; 
    alert(`Redirigiendo a la edición de la incidencia #${id}`);
    router.push(`/incidencias/editar/${id}`);
}

const asignar = async (id) => {
    try {
        const url = `http://localhost:8081/api/incidencias/detalle?id=${id}`;
        const resp = await axios.get(url);
        incidenciaSeleccionada.value = resp.data; 
        mostrarAsignarModal.value = true; 
        
    } catch (err) {
        console.error("Error al cargar detalle para asignar:", err);
        alert("❌ No se pudo cargar el detalle de la incidencia para la asignación.");
    }
}
const cerrarAsignarModal = () => {
    mostrarAsignarModal.value = false;
}
const incidenciaAsignadaHandler = (incidenciaActualizada) => {
    cerrarAsignarModal(); 
    cargarIncidencias(); 
}

const modificar = (id) => {
    alert(`Modificar la incidencia #${id}`)
}
const mostrarMensajeExito = (mensaje) => {
    alert('✅ ' + mensaje);
}
const confirmarEliminar = (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la incidencia #${id}? Esta acción no se puede deshacer.`)) {
        eliminarIncidencia(id);
    }
}

const eliminarIncidencia = async (id) => {
    try {
        await axios.delete(`http://localhost:8081/api/incidencias/${id}`); 
        
        alert(`✅ Incidencia #${id} eliminada con éxito.`);
        cargarIncidencias(); 
        
    } catch (err) {
        console.error("Error al eliminar incidencia:", err);
        alert("❌ Error al eliminar la incidencia. Revise la consola del backend.");
    }
}
// Funciones de utilidad para la tabla
const formatFecha = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const truncateText = (text, maxLength = 30) => {
    if (!text) return 'Sin descripción';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

const estadoClass = (estadoTipo) => { 
    switch (estadoTipo) {
        case 'Abierta':
            return 'status-open';
        case 'En Proceso':
            return 'status-in-progress';
        case 'Cerrada':
            return 'status-closed';
        default:
            return 'status-default';
    }
}

// Logout
const logout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
        router.push("/login")
    }
}

// Navegación
const navigateTo = (path) => {
    router.push(path)
}
</script>

<style scoped src="./Dashboard.css"></style>