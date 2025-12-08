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

      <section class="user-table-section">
        <div class="section-header">
            <h2>Lista de Responsables</h2>
        </div>

        <div class="table-container">
            <table class="data-table user-table">
              <thead>
                <tr>
                  <th>ID Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Nombre de Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usuarios" :key="user.id_user">
                  <td>{{ user.id_user }}</td>
                  <td>{{ user.n_user }}</td> 
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>

                  <td>
                    <select
                      :value="user.rol"
                      @change="simularActualizarRol(user.id_user, user.n_user, $event.target.value)"
                      class="rol-select rol-default" 
                    >
                      <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">
                        {{ rol }}
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                        @click="simularEliminar(user.id_user, user.n_user)"
                        class="btn-action delete"
                        title="Simular Eliminación"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="usuarios.length === 0" class="no-data">
                No hay responsables registrados.
            </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import "./Dashboard.css";

const router = useRouter();
const route = useRoute();
const currentRoute = route.path;

const userName = "Administrador";
const usuarios = ref([]);
const rolesDisponibles = ref(['ADMIN', 'SOPORTE', 'USUARIO']); 

// --- DEFINICIÓN DE RUTA BASE RELATIVA ---
const API_BASE_PATH = "/api/usuarios";


onMounted(() => {
    cargarUsuarios();
});


// --- FUNCIÓN CORREGIDA: CARGAR USUARIOS ---
const cargarUsuarios = async () => {
    try {
        // Usa la ruta relativa /api/usuarios/responsables
        const resp = await axios.get(`${API_BASE_PATH}/responsables`);

        console.log("Datos recibidos del backend. Verifica los nombres de las propiedades:", resp.data);

        usuarios.value = resp.data.map(user => ({
            ...user,
            id_user: user.id_user || user.id, 
            n_user: user.n_user || user.nombre || 'N/D', 
            rol: user.id_user === 1 ? 'ADMIN' : (user.id_user === 2 ? 'SOPORTE' : 'USUARIO') 
        }));

    } catch (err) {
        console.error("Error al cargar responsables:", err);
        alert("❌ No se pudo cargar la lista de responsables.");
    }
};

const simularActualizarRol = (idUsuario, nombreUsuario, nuevoRol) => {
    alert(`El rol del responsable "${nombreUsuario}" (ID: #${idUsuario}) se cambiaría a: ${nuevoRol}.`);
    
    const index = usuarios.value.findIndex(u => u.id_user === idUsuario);
    if (index !== -1) {
        usuarios.value[index].rol = nuevoRol;
    }
};

const simularEliminar = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de la eliminación de "${nombre}" (ID: #${id})?`)) {
        alert(`El usuario #${id} se eliminaría del sistema.`);
        usuarios.value = usuarios.value.filter(u => u.id_user !== id);
    }
};
const logout = () => {
  if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped src="./Dashboard.css"></style>