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
            <span>Notificaciones</span>
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
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import './Dashboard.css';

const router = useRouter();
const route = useRoute();
const userName = "Administrador";

const currentRoute = computed(() => route.path);

const navigateTo = (path) => {
  router.push(path);
};

const logout = () => {
  if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};
</script>

<style scoped src="./Dashboard.css"></style>