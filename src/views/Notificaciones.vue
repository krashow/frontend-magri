<template>
<div class="dashboard">
    <aside class="sidebar">
        <div class="sidebar-logo">
            <img src="/logo.png" alt="Logo" />
        </div>
        <nav class="menu">
            <ul>
                <li 
                    :class="{ active: currentRoute === '/dashboard' }"
                    @click="navigateTo('/dashboard')"
                >
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Inicio</span>
                </li>
                <li 
                    :class="{ active: currentRoute === '/registrar-incidencia' }"
                    @click="navigateTo('/registrar-incidencia')"
                >
                    <i class="fas fa-plus-circle"></i>
                    <span>Registrar Incidencia</span>
                </li>
                <li 
                    :class="{ active: currentRoute === '/incidencias' }"
                    @click="navigateTo('/incidencias')"
                >
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

        <div v-if="currentRoute === '/notificaciones'" class="incidencias-asignadas-page">
            <h2 class="page-title">Incidencias Asignadas a Mi</h2>

            <div class="form-container">
                <label for="responsableId">Ingresa tu ID de Responsable:</label>
                <input 
                    id="responsableId"
                    v-model.number="responsableId"
                    type="number" 
                    placeholder="Ej: 1"
                    :disabled="isLoading"
                />
                <button 
                    @click="cargarIncidencias" 
                    :disabled="isLoading || responsableId <= 0"
                    :class="{ 'loading-btn': isLoading }"
                >
                    <span v-if="isLoading" class="spinner"></span>
                    {{ isLoading ? 'Cargando...' : 'Buscar Asignaciones' }}
                </button>
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            
            <p v-else-if="!isLoading && incidencias.length === 0 && responsableId > 0" class="info-message">
                No se encontraron incidencias asignadas para el ID {{ responsableId }}.
            </p>

            <div v-if="incidencias.length > 0" class="table-wrapper">
                <table class="incidencias-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="incidencia in incidencias" :key="incidencia.id">
                            <td>{{ incidencia.id }}</td>
                            <td class="font-bold">{{ incidencia.titulo }}</td> 
                            <td>
                                <span :class="['estado-badge', getEstadoClass(incidencia.estado?.nombre)]">
                                    {{ incidencia.estado?.nombre || 'N/A' }}
                                </span>
                            </td>
                            <td>{{ formatDate(incidencia.fechaRegistro) }}</td>
                            <td class="description-cell">{{ incidencia.descripcion }}</td>
                            <td>
                                <button class="action-btn" @click="openGestionModal(incidencia)">
                                    <i class="fas fa-tools"></i> Gestionar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    <GestionModal
        :is-open="isModalGestionOpen"
        :incidencia="selectedIncidencia"
        :gestion-data="gestionData"
        :get-estado-class="getEstadoClass"
        :format-date="formatDate"
        @close="isModalGestionOpen = false"
        @save="simularGuardarGestion"
    />
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import axios from 'axios';
import "./Dashboard.css";
import GestionModal from '/src/views/GestionModal.vue';

const router = useRouter();
const route = useRoute();
const currentRoute = route.path;

const userName = "Administrador";

// --- Lógica del menú ---
const logout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
        localStorage.removeItem("token");
        router.push("/login");
    }
};

const navigateTo = (path) => {
    router.push(path);
};

// --- Lógica de Notificaciones.vue (Inicio) ---
const responsableId = ref(1);
const incidencias = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const API_BASE_URL = 'http://localhost:8081/api/incidencias/responsable/asignadas';

const cargarIncidencias = async () => {
    errorMessage.value = '';
    incidencias.value = [];
    isLoading.value = true;

    if (responsableId.value <= 0) {
        errorMessage.value = 'Por favor, ingresa un ID de Responsable válido.';
        isLoading.value = false;
        return;
    }

    try {
        const url = `${API_BASE_URL}?idResponsable=${responsableId.value}`;
        const response = await axios.get(url);
        
        incidencias.value = response.data;
        
    } catch (error) {
        console.error('Error al cargar las incidencias:', error);

        if (error.response && error.response.status === 404) {
            errorMessage.value = `El Responsable con ID ${responsableId.value} no fue encontrado.`;
        } else {
            errorMessage.value = 'Error de conexión con el backend. Verifica que Spring Boot esté corriendo.';
        }
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const getEstadoClass = (estadoNombre) => {
    const lowerCaseName = estadoNombre ? estadoNombre.toLowerCase() : '';
    
    if (lowerCaseName.includes("abierto") || lowerCaseName.includes("pendiente")) {
        return 'estado-rojo';
    }
    if (lowerCaseName.includes("progreso") || lowerCaseName.includes("asignado")) {
        return 'estado-amarillo';
    }
    if (lowerCaseName.includes("cerrado") || lowerCaseName.includes("resuelto")) {
        return 'estado-verde';
    }
    return 'estado-gris';
};
// --- Lógica de Notificaciones.vue (Fin) ---

const isModalGestionOpen = ref(false);
const selectedIncidencia = ref({});
const gestionData = ref({
    seguimiento: '',
    nuevoEstado: 'En Proceso',
    fechaCierre: new Date().toISOString().substring(0, 10) 
});

const openGestionModal = (incidencia) => {
    // 1. Guardar la incidencia seleccionada
    selectedIncidencia.value = { ...incidencia };

    // 2. Inicializar el formulario de gestión con el estado actual
    const currentStatus = incidencia.estado?.nombre || 'Abierto';
    gestionData.value.nuevoEstado = currentStatus;
    gestionData.value.seguimiento = `[${new Date().toLocaleDateString('es-ES')}] - Iniciando gestión.`; 

    // 3. Abrir el modal
    isModalGestionOpen.value = true;
};

const simularGuardarGestion = () => {
    // Función llamada desde el Modal (hijo)
    console.log("--- SIMULACIÓN DE GESTIÓN ---");
    console.log(`Incidencia ID: ${selectedIncidencia.value.id}`);
    console.log(`Nuevo Estado: ${gestionData.value.nuevoEstado}`);
    console.log(`Seguimiento Añadido: ${gestionData.value.seguimiento}`);
    
    if (gestionData.value.nuevoEstado === 'Cerrado' || gestionData.value.nuevoEstado === 'Resuelto') {
        console.log(`Fecha de Cierre (Simulada): ${gestionData.value.fechaCierre}`);
    }
    
    // Alerta de éxito simulada
    alert(`¡Maquetación exitosa! La incidencia #${selectedIncidencia.value.id} se actualizaría al estado: ${gestionData.value.nuevoEstado}`);
    
    isModalGestionOpen.value = false;
};


</script>

<style scoped>
/* ESTILOS DE NOTIFICACIONES.VUE AGREGADOS AQUÍ */
@import "./Dashboard.css"; 

.incidencias-asignadas-page {
    padding: 20px;
}

.page-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
}

.form-container {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 30px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.form-container input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex-grow: 1;
    max-width: 200px;
}

.form-container button {
    padding: 10px 20px;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-container button:hover:not(:disabled) {
    background-color: #357ABD;
}

.form-container button:disabled {
    background-color: #a0c3e7;
    cursor: not-allowed;
}

.spinner {
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    padding: 15px;
    background-color: #fdd;
    color: #c00;
    border: 1px solid #f00;
    border-radius: 4px;
    margin-bottom: 20px;
}
.info-message {
    padding: 15px;
    background-color: #ffffe0;
    color: #856404;
    border: 1px solid #ffeeba;
    border-radius: 4px;
    margin-bottom: 20px;
}

.table-wrapper {
    overflow-x: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
}
.incidencias-table {
    width: 100%;
    border-collapse: collapse;
}

.incidencias-table th, .incidencias-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.incidencias-table th {
    background-color: #f2f2f2;
    font-weight: 600;
    color: #555;
}

.incidencias-table tbody tr:hover {
    background-color: #fafafa;
}

.description-cell {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.estado-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.estado-rojo {
    background-color: #ffe0e0;
    color: #cc0000;
}
.estado-amarillo {
    background-color: #fffacd;
    color: #b8860b;
}
.estado-verde {
    background-color: #e0fff0;
    color: #008000;
}
.estado-gris {
    background-color: #eee;
    color: #555;
}
.action-btn {
    /* Fondo azul oscuro */
    background-color: #004d99; 
    /* Texto e ícono blanco */
    color: white; 
    
    padding: 8px 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    white-space: nowrap; 
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

/* Efecto al pasar el ratón (un poco más oscuro) */
.action-btn:hover {
    background-color: #003366; 
}

/* Efecto al hacer click (para feedback visual) */
.action-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-btn i {
    margin-right: 5px;
}
</style>