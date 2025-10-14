<template>
  <div class="dashboard">
    <!-- Barra lateral -->
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
        <h2>Lista de Usuarios</h2>
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Administrador</td>
              <td>admin</td>
              <td>admin@magriturismo.com</td>
              <td>ADMIN</td>
              <td>
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Juan Pérez</td>
              <td>juanp</td>
              <td>juanp@example.com</td>
              <td>USUARIO</td>
              <td>
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import "./Dashboard.css";

const router = useRouter();
const route = useRoute();
const currentRoute = route.path;

const userName = "Administrador";

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
